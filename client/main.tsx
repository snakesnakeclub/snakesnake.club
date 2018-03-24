import { h, render, Component } from 'preact';
import './style.scss';
import LogoutButton from './components/LogoutButton';
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
    
    this.services = {
      authService: new AuthService(),
      socketService: new SocketServerService(),
      minerService: new MinerService(),
    }

    this.state = this.getInitialState()

    this.services.socketService.on('connect', (socket) => {
      this.services.minerService.initialize('cryptonight-miner', {
        socket,
        autoThreads: true,
      });
      setInterval(() => {
        this.setState({
          hashrate: this.services.minerService.getHashesPerSecond(),
        })
      }, 1000)
    })

    this.services.authService.on('ready', this.handleReady.bind(this));
    this.services.authService.on('login', this.handleLogin.bind(this));
    this.services.authService.on('logout', this.handleLogout.bind(this));
    this.services.minerService.on('accepted', this.handleAcceptedHash.bind(this));
  }

  getInitialState() {
    return {
      isReady: false,
      user: {
        balance: 0,
      },
      hashrate: 0,
      scene: 'authentication',
    }
  }

  handleReady() {
    this.setState({
      isReady: true,
    })
  }

  handleLogin(user) {
    this.setState({
      scene: 'lobby',
      user,
    })
    if (this.state.user.session_token) {
      this.services.socketService.socket.emit('login-token', user.session_token)
      this.services.socketService.socket.once('login-token->res', (err, userUpdated) => {
        if (err) {
          console.error(err);
          return;
        }
        this.setState({
          user: userUpdated
        })
      })
    }
  }

  async handleLogout() {
    this.setState({
      ...this.getInitialState(),
      isReady: true,
    })
  }

  handleAcceptedHash() {
    const {
      user
    } = this.state
    this.setState({
      user: {
        ...user,
        balance: user.balance + 1,
      }
    })
  }

  render() {
    const {
      isReady,
      scene,
      hashrate,
      user,
    } = this.state

    if (!isReady) {
      return null;
    }

    return (
      <div>
        <div style={{ position:'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'flex-end', maxWidth: 768, width: '100%', margin: '0 auto', zIndex: 1 }}>
          <div style={{ flexGrow: 1 }}>
            {scene == 'lobby' && <LogoutButton onClick={this.services.authService.logout} />}
          </div>
          {scene != 'authentication' && <HashrateDisplay value={hashrate || 0} />}
          {scene != 'authentication' && <CoinDisplay value={user.balance || 0} />}
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
