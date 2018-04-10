import Skin from './Skin';

export default class Player {
  public id: number;
  public pieces: Array<PlayerPiece>;
  public skin: Skin;

  constructor(player) {
    this.id = player.id;
    this.pieces = player.pieces;
    this.skin = new Skin(player.skin);
  }

  public get head(): PlayerPiece {
    return this.pieces[this.pieces.length - 1];
  }
}

export interface PlayerPiece {
  x: number;
  y: number;
}
