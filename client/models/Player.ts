import Skin, {defaultSkin} from './Skin';

export default class Player {
  public id: number;
  public pieces: Array<PlayerPiece>;
  public skin: Skin;

  constructor(player) {
    this.id = player.id;
    this.pieces = player.pieces;
    this.skin = player.skin ? new Skin(player.skin) : defaultSkin;
  }

  public get head(): PlayerPiece {
    return this.pieces[this.pieces.length - 1];
  }

  public get tail(): PlayerPiece {
    return this.pieces[0];
  }
}

export interface PlayerPiece {
  x: number;
  y: number;
}
