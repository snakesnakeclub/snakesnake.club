export default class Skin {
  public name: string;
  public rarity: Rarity;
  public headImage;
  public bodyImage;

  constructor(skin) {
    this.name = skin.name;
    this.rarity = skin.rarity;
    this.headImage = new Image(512, 512);
    this.headImage.src = `/static/assets/skins/${this.slug}-head.png`;
    this.bodyImage = new Image(512, 512);
    this.bodyImage.src = `/static/assets/skins/${this.slug}-body.png`;
  }

  public get slug(): string {
    return encodeURIComponent(this.name.toLowerCase());
  }
  
  public get rarityPretty() {
    const rarity: string = String(this.rarity);
    return rarity[0].toUpperCase() + rarity.substr(1);
  }
}

export enum Rarity {
  'common', 'rare', 'epic', 'legendary'
};

export const defaultSkin = new Skin({
  name: 'Classic',
  rarity: 'common'
});
