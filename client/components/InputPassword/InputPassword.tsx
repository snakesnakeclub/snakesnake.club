import { h, Component } from 'preact';
import InputText from '../InputText';
import ButtonIcon from '../ButtonIcon';
import './InputPassword.scss';

interface PropTypes {
  className?: string;
  label: string;
  [prop: string]: any;
}

interface StateTypes {
  visibility: boolean;
}

export default class InputPassword extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      visibility: false,
    }
  }

  handleToggleVisibility(event) {
    event.preventDefault();
    this.setState((prevState) => ({
      visibility: !prevState.visibility,
    }))
  }

  render() {
    const {
      ref,
      ...remainingProps,
    } = this.props
    const {
      visibility,
    } = this.state
    const inputType = visibility ? 'text' : 'password';
    const visibilitySrc = visibility
      ? '/static/assets/ic_visibility_off_black_24px.svg'
      : '/static/assets/ic_visibility_black_24px.svg'
    const visibilityAlt = visibility
      ? 'Hide Password'
      : 'Show Password'
    return (
      <div className="InputPassword">
        <InputText type={inputType}
          {...remainingProps} />
        <ButtonIcon className="InputPassword-visibility"
          onClick={this.handleToggleVisibility.bind(this)}
          src={visibilitySrc} 
          alt={visibilityAlt}
          frameless />
      </div>
    )
  }
}

InputPassword.defaultProps = {
  className: '',
}
