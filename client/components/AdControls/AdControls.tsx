import { h, Component } from 'preact';
import * as VASTPlayer from 'vast-player';
import ButtonText from '../ButtonText';
import './AdControls.scss';
const {VAST_URL} = require('../../credentials.json');

interface PropTypes {

}

interface StateTypes {
  isAdShown: boolean;
}

export default class MiningControls extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      isAdShown: false,
    }
  }

  handleShowAd() {
    this.setState({ isAdShown: true });
  }

  handleHideAd() {
    this.setState({ isAdShown: false });
  }

  render() {
    const {
      isAdShown,
    } = this.state;
    const isAdShownClass = isAdShown ? 'AdControls--blackhole-shown' : '';
    return (
      <div>
        <img className={`AdControls--blackhole ${isAdShownClass}`}
          src="/static/assets/black-hole.svg"
          alt="" />

        {!isAdShown && (
          <div className="AdControls--adhole">
            <img className="AdControls--adhole-image"
              src="/static/assets/black-hole-filled.svg"
              alt="" />
            <ButtonText className="AdControls--adhole-button"
              value="Ad Hole"
              onClick={this.handleShowAd.bind(this)}
              style={{ margin: 0 }} />
          </div>
        )}

        {isAdShown && <VastVideo onAdStopped={this.handleHideAd.bind(this)} />}
      </div>
    );
  }
}

class VastVideo extends Component<any, any> {
  private adContainer: HTMLDivElement = null;

  constructor(props) {
    super();
  } 

  componentDidMount() {
    const {
      onAdStopped,
    } = this.props
    const player = new VASTPlayer(this.adContainer);

    player.load(VAST_URL)
      .then(() => player.startAd())
      .catch(console.error)
    
    player.once('AdStopped', onAdStopped);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <div class="AdControls--interstitial"
        ref={el => {this.adContainer = el as HTMLDivElement}} />
    )
  }
}
