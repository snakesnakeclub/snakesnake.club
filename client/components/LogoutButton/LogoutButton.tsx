import { h, Component } from 'preact';
import ButtonIcon from '../ButtonIcon';

interface PropTypes {
  onClick: (event) => void;
}

interface StateTypes {

}

export default class LogoutButton extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      onClick
    } = this.props
    return (
      <ButtonIcon src="/static/assets/ic_exit_to_app_white_24px.svg"
        alt="Logout"
        imgWidth={24}
        imgHeight={24}
        title="Logout"
        onClick={onClick} />
    )
  }
}
