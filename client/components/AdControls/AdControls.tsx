import { h, Component } from 'preact';
import ButtonIcon from '../ButtonIcon';
import './AdControls.scss';


const VASTPlayer = require('vast-player');

interface PropTypes {

}

interface StateTypes {
  showingAd: boolean;
}

export default class MiningControls extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
    this.state = {
      showingAd: false,
    }
  }

  handleShowAd() {
    this.setState({
      showingAd:true,
    })
    const player = new VASTPlayer(document.getElementById("container"));
    player.load(
      "http://ads.aerserv.com/as/?plc=1035184&cb=&url=&ip=&make=&model=&os=&osv=&type=&lat=&long=&locationsource=&ua=&vpw=&vph=&vpaid=&coppa=&age=&yob=&gender="
    ).then(function startAd() {
        return player.startAd();
    }).catch(function(reason) {
      console.log(reason);
    })
    
    player.once('AdStopped', function() {
      this.setState({
        showingAd:false,
      })
    })

  }

  render() {
    const {
      showingAd,
    } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <ButtonIcon 
          src="/static/assets/ic_play_arrow_white_24px.svg"
          alt="Show Ad"
          title="View Ad"
          onClick={this.handleShowAd.bind(this)}
          imgWidth={24}
          imgHeight={24} 
          style={{ margin: 7 }} />

        <div id="container"></div>
      </div>
    );
  }
}
