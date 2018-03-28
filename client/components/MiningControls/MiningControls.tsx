import { h, Component } from 'preact';
import MinerService from '../../services/Miner.service';
import ButtonIcon from '../ButtonIcon';
import ButtonText from '../ButtonText';
import './MiningControls.scss';

interface PropTypes {
  minerService: MinerService;
}

interface StateTypes {

}

export default class MiningControls extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
  }

  handleMiningToggle() {
    const {
      minerService,
    } = this.props
    if (minerService.isRunning) {
      minerService.stop();
    } else {
      minerService.start();
    }
    this.setState({})
  }

  handleSpeedUp() {
    const {
      minerService,
    } = this.props
    const threads = Math.min(minerService.getNumThreads() + 1, minerService.hardwareConcurrency);
    minerService.setNumThreads(threads);
    this.setState({})
  }

  handleSlowDown() {
    const {
      minerService,
    } = this.props
    const threads = Math.max(minerService.getNumThreads() - 1, 1);
    minerService.setNumThreads(threads);
    this.setState({})
  }

  render() {
    const {
      minerService,
    } = this.props
    return (
      <div style={{ display: 'flex' }}>
        {!minerService.isRunning && (
          <ButtonText value="Start Mining"
            onClick={this.handleMiningToggle.bind(this)}
            style={{ margin: 7 }} />
        )}
        
        {minerService.isRunning && (
          <ButtonIcon src="/static/assets/ic_pause_white_24px.svg"
            alt="Stop Mining"
            title="Stop Mining"
            onClick={this.handleMiningToggle.bind(this)}
            imgWidth={24}
            imgHeight={24} 
            style={{ margin: 7 }} />
        )}

        {minerService.isRunning && (
          <ButtonIcon src="/static/assets/ic_trending_up_white_24px.svg"
            alt="Speed Up"
            title="Speed up mining"
            onClick={this.handleSpeedUp.bind(this)}
            imgWidth={24}
            imgHeight={24}
            style={{ margin: 7 }} />
        )}

        {minerService.isRunning && (
          <ButtonIcon src="/static/assets/ic_trending_down_white_24px.svg"
            alt="Slow Down"
            title="Slow down mining"
            onClick={this.handleSlowDown.bind(this)}
            imgWidth={24}
            imgHeight={24} 
            style={{ margin: 7 }} />
        )}

        {minerService.isRunning && (
          <div class="MiningControls--threads"
            title={minerService.getNumThreads() + " active mining threads"}>
            {Array.from(Array(minerService.hardwareConcurrency))
              .map((_, i) => (
                <div class={i < minerService.getNumThreads()
                  ? "MiningControls--thread-active"
                  : "MiningControls--thread-inactive"}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}
