import { h, Component } from 'preact';
import Recaptcha from 'preact-google-recaptcha';
import ServicesInterface from '../../services/interface';
import InputText from '../../components/InputText';
import InputPassword from '../../components/InputPassword';
import ButtonText from '../../components/ButtonText';
import Toast from '../../components/Toast';
import './AuthenticationScene.scss';
import * as strings from '../../strings.json';
const {RECAPTCHA_PUBLIC} = require('../../credentials.json');

interface PropTypes {
  services: ServicesInterface;
}

interface StateTypes {
  email: string;
  username: string;
  password: string;
  formAction: string;
  validationErrors: Array<string>;
  toast: string;
  isLoading: boolean;
}

export default class AuthenticationScene extends Component<PropTypes, StateTypes> {
  private recaptcha;
  private handleRecaptchaChange: Function;

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      formAction: 'login',
      validationErrors: [],
      toast: null,
      isLoading: false,
    }
  }

  handleAuthenticate(event) {
    event.preventDefault();
    const {
      authService,
    } = this.props.services
    const {
      formAction,
      email,
      username,
      password,
    } = this.state;

    this.setState({
      validationErrors: [],
      isLoading: true
    });

    switch(formAction) {
      case 'login':
        authService.login(email, password)
          .then(() => {
            this.setState({
              validationErrors: [],
              isLoading: false
            });
          })
          .catch(this.handleRestApiError.bind(this))
          break;

      case 'register':
        this.handleRecaptchaChange = (gRecaptchaValue) => {
          authService.register(gRecaptchaValue, email, username, password)
            .then(() => {
              this.setState({
                validationErrors: [],
                isLoading: false
              });
            })
            .catch(this.handleRestApiError.bind(this))
          this.recaptcha.reset();
        };
        this.recaptcha.execute();
        break;
    }
  }

  handleForgotPasswordClick() {
    const {
      authService,
    } = this.props.services
    const {
      email,
    } = this.state

    this.setState({
      validationErrors: [],
      isLoading: true,
    })

    this.handleRecaptchaChange = (gRecaptchaValue) => {
      authService.resetPassword(gRecaptchaValue, email)
        .then(() => {
          this.setState({
            toast: 'check your inbox',
            validationErrors: [],
            isLoading: false,
          })
        })
        .catch(this.handleRestApiError.bind(this))
      this.recaptcha.reset();
    };
    this.recaptcha.execute();
  }

  handleResendVerificationClick() {
    const {
      authService,
    } = this.props.services
    const {
      email,
    } = this.state

    this.setState({
      validationErrors: [],
      isLoading: true,
    })

    this.handleRecaptchaChange = (gRecaptchaValue) => {
      authService.resetVerification(gRecaptchaValue, email)
        .then(() => {
          this.setState({
            toast: 'check your inbox',
            validationErrors: [],
            isLoading: false,
          })
        })
        .catch(this.handleRestApiError.bind(this))
      this.recaptcha.reset();
    };
    this.recaptcha.execute();
  }

  handleRestApiError(data) {
    if (!data.error) {
      console.error(data);
      return;
    }
    if (data.code === '500') {
      this.setState({
        validationErrors: ['500'],
        isLoading: false,
      })
    } else if (data.validationErrors) {
      this.setState({
        validationErrors: data.validationErrors,
        isLoading: false,
      }) 
    } else {
      this.setState({
        validationErrors: [data.code],
        isLoading: false,
      }) 
    }
  }

  render() {
    const {
      formAction,
      validationErrors,
      isLoading,
      toast,
      email,
      username,
      password,
    } = this.state;
    
    return (
      <div className="AuthenticationScene">
        <form onSubmit={this.handleAuthenticate.bind(this)}
          className="AuthenticationScene-form"
          autocomplete="on">
          <img className="AuthenticationScene-form-logo"
            src="/static/assets/logo.png"
            alt="SnakeSnake.Club" />
          <InputText name="email"
            label={formAction === 'login' ? "Email Address or Username" : 'Email Address'}
            autocomplete="username"
            onInput={({ target }) => this.setState({ email: target.value })}
            value={email}
            required />
          {formAction === 'register' && (
            <InputText name="username"
              label="Username"
              autocomplete="username"
              onInput={({ target }) => this.setState({ username: target.value })}
              value={username}
              required />
          )}
          <InputPassword name="password"
            label="Password"
            autocomplete="password"
            onInput={({ target }) => this.setState({ password: target.value })}
            value={password}
            required />
          <div className="AuthenticationScene-form-buttons">
            <ButtonText type={formAction == 'login' ? 'submit' : 'button'}
              value="Login"
              disabled={isLoading}
              onClick={(event) => {
                if (formAction != 'login') {
                  event.preventDefault();
                  this.setState({
                    validationErrors: [],
                    formAction: 'login'
                  })
                }
              }}
              primary={formAction == 'login'} />
            <ButtonText type={formAction == 'register' ? 'submit' : 'button'}
              value="Register"
              disabled={isLoading}
              onClick={(event) => {
                if (formAction != 'register') {
                  event.preventDefault();
                  this.setState({
                    validationErrors: [],
                    formAction: 'register'
                  })
                }
              }}
              primary={formAction == 'register'} />
          </div>
          {formAction === 'login' && (
            <ButtonText value="forgot password"
              onClick={this.handleForgotPasswordClick.bind(this)}
              disabled={isLoading}
              frameless />
          )}
          {formAction === 'register' && (
            <ButtonText value="resend verification"
              onClick={this.handleResendVerificationClick.bind(this)}
              disabled={isLoading}
              frameless />
          )}
          <div style={{ width: '100%' }}>
            {validationErrors.map((errorCode) => (
              <p className="AuthenticationScene-form-errors">
                {strings[errorCode] || errorCode}
              </p>
            ))}
          </div>
          {toast && (
            <Toast message={toast}
              duration={5}
              onDurationEnd={this.setState.bind(this, { toast: null })} />
          )}
        </form>

        <Recaptcha
          ref={el => {this.recaptcha = el}}
          sitekey={RECAPTCHA_PUBLIC}
          size="invisible"
          badge="bottom-right"
          theme="dark"
          onChange={this.handleRecaptchaChange}
        />
      </div>
    )
  }
}
