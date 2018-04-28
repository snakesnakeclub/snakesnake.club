import { h, Component } from 'preact';
import './ButtonText.scss';

interface PropTypes {
  className?: string;
  frameless?: boolean;
  refButton?: (el: HTMLButtonElement) => void;
  primary?: boolean;
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
      refButton,
      frameless,
      primary,
      ...remainingProps,
    } = this.props
    const framelessClass = frameless ? 'ButtonText-frameless' : ''
    const primaryClass = primary ? 'ButtonText-primary' : '';
    return (
      <input type="button"
        ref={refButton}
        className={`ButtonText ${framelessClass} ${className} ${primaryClass}`}
        {...remainingProps}
      />
    );
  }
}

ButtonText.defaultProps = {
  className: '',
  frameless: false,
  primary: true,
}
