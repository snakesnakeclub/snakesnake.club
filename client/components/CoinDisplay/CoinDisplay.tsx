import { h, Component } from 'preact'
import NumberDisplay from '../NumberDisplay'
import Tooltip from '../Tooltip'
import './CoinDisplay.scss';

interface PropTypes {
  value: number;
}

interface StateTypes {
}

export default class CoinDisplay extends Component<PropTypes, StateTypes> {
  private animation?: number;

  constructor(props: PropTypes) {
    super(props);
  }

  render() {
    const {
      value,
    } = this.props
    return (
      <NumberDisplay value={value}
        aria-label={`${value} coins`}
      >
        <img className="CoinDisplay-coin"
          src="/static/assets/coin.svg"
          alt=""
        />
        <Tooltip id="CoinDisplay-tooltip">
          <span style="color: #cfa403;">Gold</span> has real world value.
          <br/>
          You can cash it out for <img className="CoinDisplay-tooltip-monero"
            src="/static/assets/monero.svg" alt="" /> <a href="https://getmonero.org"
            target="_blank" rel="noopener">Monero</a>.
        </Tooltip>
      </NumberDisplay>
    )
  }
}
