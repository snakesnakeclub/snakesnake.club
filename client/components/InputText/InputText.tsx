import { h, Component } from 'preact';
import './InputText.scss';

interface PropTypes {
  className?: string;
  label: string;
  refInput?: (el: HTMLInputElement) => void;
  [prop: string]: any;
}

interface StateTypes {

}

export default class InputText extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props)
  }

  render() {
    const {
      className,
      ref,
      refInput,
      label,
      ...remainingProps,
    } = this.props
    return (
      <label className="InputText-label">
        <span className="InputText-label-text">
          {label}
        </span>
        <input type="text"
          ref={refInput}
          className={`InputText ${className}`}
          {...remainingProps}
        />
      </label>
    )
  }
}

InputText.defaultProps = {
  className: '',
}
