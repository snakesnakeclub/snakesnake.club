import { h, Component } from 'preact';
import InputText from '../../components/InputText';
import InputPassword from '../../components/InputPassword';
import ButtonText from '../../components/ButtonText';
import ServicesInterface from '../services/interface';
import './AuthenticationScene.scss';
import * as strings from '../../strings.json';

interface PropTypes {
  services: ServicesInterface;
}

interface StateTypes {
  formAction: string;
  validationErrors: Array<string>;
  isLoading: boolean;
}

export default class AuthenticationScene extends Component<PropTypes, StateTypes> {
  private email: string = '';
  private username: string = '';
  private password: string = '';

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      formAction: 'login',
      validationErrors: [],
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
    } = this.state;

    this.setState({
      isLoading: true
    });

    switch(formAction) {
      case 'login':
        authService.login(this.email, this.password)
          .then(() => {
            this.setState({
              validationErrors: [],
              isLoading: false
            });
          })
          .catch((data) => {
            this.setState({
              validationErrors: data.validationErrors,
              isLoading: false,
            })
          })
          break;

      case 'register':
        authService.register(this.email, this.username, this.password)
          .then(() => {
            this.setState({
              validationErrors: [],
              isLoading: false
            });
          })
          .catch((data) => {
            this.setState({
              validationErrors: data.validationErrors,
              isLoading: false,
            })
          })
        break;
    }
  }

  render() {
    const {
      formAction,
      validationErrors,
      isLoading,
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
            onInput={({ target }) => {this.email = target.value}}
            required />
          {formAction === 'register' && (
            <InputText name="username"
              label="Username"
              autocomplete="username"
              onInput={({ target }) => {this.username = target.value}}
              required />
          )}
          <InputPassword name="password"
            label="Password"
            autocomplete="password"
            onInput={({ target }) => {this.password = target.value}}
            required />
          <div className="AuthenticationScene-form-buttons">
            <ButtonText type="submit"
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
            <ButtonText type="submit"
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
          <div style={{ width: '100%' }}>
            {validationErrors.map((error) => (
              <p className="AuthenticationScene-form-errors">
                {strings[error]}
              </p>
            ))}
          </div>
        </form>
      </div>
    )
  }
}
