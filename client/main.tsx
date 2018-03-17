import { h, render, Component } from 'preact';
import './style.scss';
import CoinDisplay from './components/CoinDisplay';
import HashrateDisplay from './components/HashrateDisplay';
import AuthenticationScene from './scenes/AuthenticationScene';

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      balance: 0,
      hashrate: 0,
    }
  }

  render() {
    return (
      <div>
        <div style={{ position:'fixed', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'flex-end', maxWidth: 768, width: '100%', margin: '0 auto' }}>
          <HashrateDisplay value={this.state.hashrate} />
          <CoinDisplay value={this.state.balance} />
        </div>

        <AuthenticationScene />
      </div>
    )
  }
}

render(
  <App />,
  document.getElementById('game-overlay')
);
