import { h, Component } from 'preact';
import './Toast.scss';

interface PropTypes {
  message: string;
  duration: number; // seconds
  onDurationEnd: () => void;
}

interface StateTypes {
  isShown: boolean;
}

export default class Toast extends Component<PropTypes, StateTypes> {
  private hideTimeoutId: number = null;
  private endTimeoutId: number = null;

  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
    };
  }

  componentDidMount() {
    const {
      duration,
    }  = this.props
    const durationMs = duration * 1000;
    this.hideTimeoutId = setTimeout(this.handleBeforeDurationEnd.bind(this), durationMs - 250);
    this.endTimeoutId = setTimeout(this.handleDurationEnd.bind(this), durationMs);
    setTimeout(this.setState.bind(this, { isShown: true }));
  }

  handleBeforeDurationEnd() {
    this.setState({
      isShown: false,
    });
  }

  handleDurationEnd() {
    const {
      onDurationEnd,
    } = this.props;
    onDurationEnd();
  }

  render() {
    const {
      message,
    } = this.props;
    const {
      isShown,
    } = this.state;
    const isShownClass = isShown ? 'Toast--show' : '';
    return (
      <div className={`Toast ${isShownClass}`}
        role="alert"
        aria-live="polite">
        {message}
      </div>
    )
  }
}
