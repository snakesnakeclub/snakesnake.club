import { h, Component } from 'preact';
import Skin from '../../models/Skin';
import Tooltip from '../Tooltip'
import './PlayerSkin.scss';

interface PropTypes {
  skin: Skin;
}

interface StateTypes {

}

export default class PlayerSkin extends Component<PropTypes, StateTypes> {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      skin,
    } = this.props
    return (
      <div className={`PlayerSkin PlayerSkin--rarity-bg-${skin.rarity}`}>
        <div className="PlayerSkin--snake"
          aria-label={`${skin.name} ${skin.rarity} skin`}
          title={`${skin.name} ${skin.rarity} skin`}>
          <img src={skin.headUrl}
            alt={`${skin.name} skin head`}
            className="PlayerSkin--piece" />
          <img src={skin.bodyUrl}
            alt={`${skin.name} skin body`}
            className="PlayerSkin--piece" />
        </div>

        <Tooltip id="PlayerSkin-tooltip"
          style={{ width: 180, bottom: 0, left: '50%', transform: 'translate(-50%, 100%)' }}>
          <span className={`PlayerSkin--name PlayerSkin--rarity-fg-${skin.rarity}`}>
            {skin.name} skin
          </span>
          
          <br/>

          <span>
            {skin.rarityPretty} rarity
          </span>
        </Tooltip>
      </div>
    );
  }
}
