import { h, render, Component } from 'preact';
import './style.scss';
import CoinDisplay from './components/CoinDisplay';
import HashrateDisplay from './components/HashrateDisplay';
import AuthenticationScene from './scenes/AuthenticationScene';
import LobbyScene from './scenes/LobbyScene';
import AuthService from './services/Auth.service';
import SocketServerService from './services/SocketServer.service';
import MinerService from './services/Miner.service';
import ServicesInterface from './services/interface';

class App extends Component<any, any> {
  private services: ServicesInterface;

  constructor(props: any) {
    super(props);
    
    this.state = {
      user: null,
      hashrate: 0,
      scene: 'authentication',
    };

    this.services = {
      authService: new AuthService(),
      socketService: new SocketServerService(),
      minerService: new MinerService(),
    }

    this.services.socketService.on('connect', (socket) => {
      this.services.minerService.initialize('cryptonight-miner', {
        socket,
        autoThreads: true,
      });
      // this.services.minerService.start()
    })

    setInterval(() => {
      this.setState({
        hashrate: this.services.minerService.getHashesPerSecond(),
      })
    }, 1000)

    this.services.authService.on('login', this.handleLogin.bind(this));
    this.services.authService.on('logout', this.handleLogout.bind(this));
  }

  handleLogin(user) {
    this.setState({
      scene: 'lobby',
      user,
    })
  }

  handleLogout() {
    this.setState({
      scene: 'authentication',
      user: null,
    })
  }

  render() {
    const {
      scene
    } = this.state
    return (
      <div>
        <div style={{ position:'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'flex-end', maxWidth: 768, width: '100%', margin: '0 auto', zIndex: 1 }}>
          <HashrateDisplay value={this.state.hashrate || 0} />
          <CoinDisplay value={this.state.user ? this.state.user.balance : 0} />
        </div>

        {scene == 'authentication' && <AuthenticationScene services={this.services} />}
        {scene == 'lobby' && <LobbyScene services={this.services} />}
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('game-overlay')
);
