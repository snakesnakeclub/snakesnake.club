import { h, Component } from 'preact';
import * as VASTPlayer from 'vast-player';
import ButtonIcon from '../ButtonIcon';
import './AdControls.scss';
const {VAST_URL} = require('../../credentials.json');

interface PropTypes {

}

interface StateTypes {
  isAdShown: boolean;
}

export default class MiningControls extends Component<PropTypes, StateTypes> {
  private adContainer: HTMLDivElement = null;

  constructor(props) {
    super(props);
    this.state = {
      isAdShown: false,
    }
  }

  handleShowAd() {
    this.setState({ isAdShown: true })

    const player = new VASTPlayer(this.adContainer);

    player.load(VAST_URL)
      .then(() => player.startAd())
      .catch(console.error)
    
    player.once('AdStopped', this.setState.bind(this, { isAdShown: false }))
  }

  render() {
    const {
      isAdShown,
    } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        {isAdShown === false && (
          <ButtonIcon 
            src="/static/assets/ic_play_arrow_white_24px.svg"
            alt="Show Ad"
            title="View Ad"
            onClick={this.handleShowAd.bind(this)}
            imgWidth={24}
            imgHeight={24} 
            style={{ margin: 7 }} />
        )}

        <div class="AdControls--interstitial"
          ref={el => {this.adContainer = el as HTMLDivElement}}
          style={{ display: isAdShown ? '' : 'none' }} />
      </div>
    );
  }
}
