export default class Room {
  public id: number;
  public fee: number;

  constructor(room) {
    this.id = room.id;
    this.fee = room.fee;
  }
}
