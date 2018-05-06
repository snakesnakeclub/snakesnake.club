export default class Reward {
  public type: number;
  public x: number;
  public y: number;

  constructor(reward) {
    this.type = RewardTypes[reward.type];
    this.x = reward.x;
    this.y = reward.y;
  }
}

export const RewardTypes = {
  'grow-respawn': 0,
  'grow': 1,
  'takedown': 2,
};
