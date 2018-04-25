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
    const threads = minerService.isRunning
      ? minerService.getNumThreads()
      : 0;
    return (
      <div>
        <p style={{
          margin: '30px 7px 10px 7px',
        }} >
          Mining
        </p>

        <div style={{ display: 'flex' }}>
          <ButtonIcon src={minerService.isRunning
            ? "/static/assets/ic_pause_white_24px.svg"
            : "/static/assets/ic_play_arrow_white_24px.svg"}
            alt={minerService.isRunning
              ? "Stop Mining"
              : "Start Mining"}
            title={minerService.isRunning
              ? "Stop Mining"
              : "Start Mining"}
            onClick={this.handleMiningToggle.bind(this)}
            imgWidth={24}
            imgHeight={24} 
            style={{ margin: 7 }} />

          <ButtonIcon src="/static/assets/ic_trending_up_white_24px.svg"
            alt="Speed Up"
            title="Speed up mining"
            onClick={this.handleSpeedUp.bind(this)}
            imgWidth={24}
            imgHeight={24}
            style={{ margin: 7 }}
            disabled={!minerService.isRunning} />

          <ButtonIcon src="/static/assets/ic_trending_down_white_24px.svg"
            alt="Slow Down"
            title="Slow down mining"
            onClick={this.handleSlowDown.bind(this)}
            imgWidth={24}
            imgHeight={24} 
            style={{ margin: 7 }}
            disabled={!minerService.isRunning} />

          <div class="MiningControls--threads"
            title={threads + " active mining threads"}>
            {Array.from(Array(minerService.hardwareConcurrency))
              .map((_, i) => (
                <div class={i < threads
                  ? "MiningControls--thread-active"
                  : "MiningControls--thread-inactive"}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
