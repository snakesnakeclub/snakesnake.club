import { h, Component } from 'preact';
import ButtonText from '../../components/ButtonText';
import ButtonIcon from '../../components/ButtonIcon';
import ServicesInterface from '../../services/interface';
import './LobbyScene.scss';

interface PropTypes {
  services: ServicesInterface;
}

interface StateTypes {
  activeTab: string;
}

export default class LobbyScene extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      activeTab: 'battle'
    }
  }

  getActiveTabClass(tab) {
    const {
      activeTab,
    } = this.state;
    return tab == activeTab ? 'LobbyScene-navigation-item-active' : ''
  }

  render() {
    const {
      activeTab
    } = this.state
    return (
      <div className="LobbyScene">
        <nav className="LobbyScene-navigation">
          <label className={`LobbyScene-navigation-item ${this.getActiveTabClass('shop')}`}>
            <ButtonIcon alt="Shop"
              src="/static/assets/shop.svg"
              style={{ margin: 0 }}
              onClick={() => this.setState({ activeTab: 'shop' })}
              frameless />
            <div>
              Shop
            </div>
          </label>
          <label className={`LobbyScene-navigation-item ${this.getActiveTabClass('battle')}`}>
            <ButtonIcon alt="Battle"
              src="/static/assets/battle.svg"
              style={{ margin: 0 }}
              onClick={() => this.setState({ activeTab: 'battle' })}
              frameless />
            <div>
              Battle
            </div>
          </label>
          <label className={`LobbyScene-navigation-item ${this.getActiveTabClass('party')}`}>
            <ButtonIcon alt="Group"
              src="/static/assets/party.svg"
              style={{ margin: 0 }}
              onClick={() => this.setState({ activeTab: 'party' })}
              frameless />
            <div>
              Group
            </div>
          </label>
        </nav>
      </div>
    )
  }
}
