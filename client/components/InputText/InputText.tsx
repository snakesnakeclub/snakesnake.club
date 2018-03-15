import { h, Component } from 'preact';
import './InputText.scss';

interface PropTypes {
    
}

interface StateTypes {

}

export default class InputText extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <input type="text"
        className="InputText"
      />
    )
  }
}
