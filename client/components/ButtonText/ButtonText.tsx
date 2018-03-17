import { h, Component } from 'preact';
import './ButtonText.scss';

interface PropTypes {
  className?: string;
  frameless?: boolean;
  [prop: string]: any;
}

interface StateTypes {

}

export default class ButtonText extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props)
  }

  render() {
    const {
      className,
      ref,
      frameless,
      ...remainingProps,
    } = this.props
    const framelessClass = frameless ? 'ButtonText-frameless' : ''
    return (
      <input type="button"
        className={`ButtonText ${framelessClass} ${className}`}
        {...remainingProps}
      />
    );
  }
}

ButtonText.defaultProps = {
  className: '',
  frameless: false,
}
