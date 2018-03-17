import { h, Component } from 'preact';
import './Tooltip.scss';

interface PropTypes {
  id: string;
}

interface StateTypes {
  
}

/**
 * @example
 * .YourComponent-coin:hover
 * + #YourComponent-tooltip {
 *   opacity: 1;
 *   pointer-events: initial;
 *   touch-action: initial;
 * }
 */
export default class Tooltip extends Component<PropTypes, StateTypes> {
  render() {
    const {
      id,
      children,
    } = this.props;
    return (
      <div id={id} className="Tooltip">
        {children}
      </div>
    )
  }
}
