export default class Player {
  public id: number;
  public pieces: Array<PlayerPiece>;
  public skin: string;

  constructor(player) {
    this.id = player.id;
    this.pieces = player.pieces;
  }

  public get head(): PlayerPiece {
    return this.pieces[this.pieces.length - 1];
  }
}

interface PlayerPiece {
  x: number;
  y: number;
}
