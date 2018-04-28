import { h, Component } from 'preact';
import User from '../../models/User';
import Tooltip from '../Tooltip';
import './PlayerBar.scss';

interface PropTypes {
  user: User;
}

interface StateTypes {
}

export default class PlayerBar extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      user,
    } = this.props
    return (
      <div className="PlayerBar">
        <p className="PlayerBar--username">
          {user.username}
        </p>

        <div className="PlayerBar--takedowns">
          <img className="PlayerBar--takedowns-icon"
            src="/static/assets/skull.svg"
            alt="Takedowns"/>

          <span className="PlayerBar--takedowns-value">
            {user.takedowns}
          </span>
        </div>

        {/* <Tooltip id="PlayerBar-tooltip"
          style={{ width: 180, bottom: 0, left: '50%', transform: 'translate(-50%, 100%)' }}>

        </Tooltip> */}
      </div>
    );
  }
}
