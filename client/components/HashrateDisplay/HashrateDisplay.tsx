import { h, Component } from 'preact'
import NumberDisplay from '../NumberDisplay'
import Tooltip from '../Tooltip'
import './HashrateDisplay.scss';

interface PropTypes {
  value: number;
}

interface StateTypes {
}

export default class HashrateDisplay extends Component<PropTypes, StateTypes> {
  private animation?: number;

  constructor(props: PropTypes) {
    super(props);
  }

  render() {
    const {
      value,
    } = this.props
    const miningClass = value > 0 ? 'HashrateDisplay-pickaxe-mining' : '';
    return (
      <NumberDisplay value={value}
        aria-label={`${value} hashes per second`}
        suffix="H/s"
        style={{ width: 70 }}
      >
        <img className={`HashrateDisplay-pickaxe ${miningClass}`}
          src="/static/assets/pickaxe.svg"
          alt=""
          style={{
            animationDuration: value > 0 ? `${Math.round(10000 / Math.min(value, 100))}ms` : undefined
          }}
        />
        <Tooltip id="HashrateDisplay-tooltip"
          style={{ width: 140, bottom: -1, right: -6 }}>
          <span style="color: indigo;">Hashrate</span> is the number of hashes per second.
          <br/>
          Higher hashrate generates more gold over time.
        </Tooltip>
      </NumberDisplay>
    )
  }
}
