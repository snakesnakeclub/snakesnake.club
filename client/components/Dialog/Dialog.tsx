import { h, Component } from 'preact';
import './Dialog.scss';

interface PropTypes {
  shown: boolean;
  modal: boolean;
  actions: Array<JSX.Element>;
}

interface StateTypes {
  isShown: boolean;
  hideAnimationFinished: boolean;
}

export default class Dialog extends Component<PropTypes, StateTypes> {
  private hideTimeoutId;
  
  constructor(props) {
    super(props);
    this.setState({
      isShown: false,
      hideAnimationFinished: false,
    });
    
    if (props.shown) {
      this.handleShow()
    } else {
      this.handleHide()
    }
  }

  componentWillReceiveProps(next) {
    // shown changed
    if (this.props.shown !== next.shown) {
      if (next.shown) {
        this.handleShow()
      } else {
        this.handleHide()
      }
    }
  }

  handleShow() {
    this.setState({
      isShown: true,
      hideAnimationFinished: false,
    });
    clearTimeout(this.hideTimeoutId)
  }

  handleHide() {
    this.setState({
      isShown: false,
      hideAnimationFinished: false,
    });
    this.hideTimeoutId = setTimeout(() => {
      this.setState({
        isShown: false,
        hideAnimationFinished: true,
      });
    }, 500);
  }

  render() {
    const {
      children,
      actions,
    } = this.props
    const {
      isShown,
      hideAnimationFinished,
    } = this.state;
    
    if (hideAnimationFinished) {
      return null;
    }

    return (
      <div className={`Dialog ${isShown ? '' : 'Dialog--hidden'}`}
        aria-live="polite">
        <section className="Dialog--children">
          {children}
        </section>

        <footer className="Dialog--footer">
          {actions}
        </footer>
      </div>
    )
  }
}
