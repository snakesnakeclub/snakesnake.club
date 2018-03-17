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
  constructor(props) {
    super(props);
  }

  handleLogin() {
    
  }

  handleRegister() {
    
  }

  render() {
    return (
      <div className="AuthenticationScene">
        <form onSubmit={this.handleLogin}
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
          <ButtonText type="submit" value="Login" />
        </form>
      </div>
    )
  }
}
