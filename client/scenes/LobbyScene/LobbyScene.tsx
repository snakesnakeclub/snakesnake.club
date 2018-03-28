import { h, Component } from 'preact';
import ButtonText from '../../components/ButtonText';
import ButtonIcon from '../../components/ButtonIcon';
import AdControls from '../../components/AdControls';
import MiningControls from '../../components/MiningControls';
import ServicesInterface from '../../services/interface';
import Room from '../../models/room';
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
      activeTab: 'play'
    }
  }

  tabIndex(tab) {
    return {
      shop: -1,
      play: 0,
      group: 1,
    }[tab]
  }

  getActiveTabClass(tab) {
    const {
      activeTab,
    } = this.state;
    return tab == activeTab ? 'LobbyScene-navigation-item-active' : ''
  }

  handleFreeRoomJoin() {
    const {
      gameService,
    } = this.props.services;
    gameService.joinRoom(gameService.freeRoomId);
  }

  renderShopPage() {
    const {
      activeTab,
    } = this.state;
    const {
      minerService
    } = this.props.services;
    const pageTranslateX = (this.tabIndex('shop') - this.tabIndex(activeTab)) * 100;
    return (
      <div className="LobbyScene-page"
        style={{ transform: `translateX(${pageTranslateX}vw)` }}>
        <MiningControls minerService={minerService} />
        <AdControls/>
      </div>
    )
  }
  
  renderPlayPage() {
    const {
      activeTab,
    } = this.state;
    const pageTranslateX = (this.tabIndex('play') - this.tabIndex(activeTab)) * 100;
    return (
      <div className="LobbyScene-page"
        style={{ transform: `translateX(${pageTranslateX}vw)` }}>
        <ButtonText value="Practice"
          style={{ width: 180, margin: '5px 0' }}
          onClick={this.handleFreeRoomJoin.bind(this)} />
        <ButtonText value="Compete"
          style={{ width: 180, margin: '5px 0' }}
          disabled />
      </div>
    )
  }
  
  renderGroupPage() {
    const {
      activeTab,
    } = this.state;
    const pageTranslateX = (this.tabIndex('group') - this.tabIndex(activeTab)) * 100;
    return (
      <div className="LobbyScene-page"
        style={{ transform: `translateX(${pageTranslateX}vw)` }}>
        
      </div>
    )
  }

  renderNavigationBar() {
    const {
      activeTab
    } = this.state
    return (
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
        <label className={`LobbyScene-navigation-item ${this.getActiveTabClass('play')}`}>
          <ButtonIcon alt=""
            src="/static/assets/battle.svg"
            style={{ margin: 0 }}
            onClick={() => this.setState({ activeTab: 'play' })}
            frameless />
          <div>
            Play
          </div>
        </label>
        <label className={`LobbyScene-navigation-item ${this.getActiveTabClass('group')}`}>
          <ButtonIcon alt="Group"
            src="/static/assets/party.svg"
            style={{ margin: 0 }}
            onClick={() => this.setState({ activeTab: 'group' })}
            frameless />
          <div>
            Group
          </div>
        </label>
      </nav>
    )
  }

  render() {
    return (
      <div>
        {this.renderShopPage()}
        {this.renderPlayPage()}
        {this.renderGroupPage()}
        {this.renderNavigationBar()}
      </div>
    )
  }
}
