import { h, Component } from 'preact';
import InputText from '../../components/InputText';
import InputPassword from '../../components/InputPassword';
import ButtonText from '../../components/ButtonText';
import './AuthenticationScene.scss';

interface PropTypes {

}

interface StateTypes {
}

export default class AuthenticationScene extends Component<PropTypes, StateTypes> {
  action: string = 'login';

  constructor(props) {
    super(props);
  }

  handleAuthenticate(event) {
    event.preventDefault();
    switch(this.action) {
      case 'login':
        break;
      case 'register':
        break;
    }
    
  }

  render() {
    return (
      <div className="AuthenticationScene">
        <form onSubmit={this.handleAuthenticate.bind(this)}
          className="AuthenticationScene-form"
          autocomplete="on">
          <InputText type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            autocomplete=""
            required />
          <InputPassword label="Password"
            placeholder="••••••••"
            autocomplete=""
            required />
          <div className="AuthenticationScene-form-buttons">
            <ButtonText type="submit"
              value="Login"
              onClick={() => { this.action = 'login' }} />
            <ButtonText type="submit"
              value="Register"
              onClick={() => { this.action = 'register' }}/>
          </div>
        </form>
      </div>
    )
  }
}
