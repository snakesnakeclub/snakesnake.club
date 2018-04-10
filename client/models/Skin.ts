export default class Skin {
  public name: string;
  public rarity: Rarity;

  constructor(skin) {
    this.name = skin.name;
    this.rarity = skin.rarity;
  }

  public get slug() {
    return encodeURIComponent(this.name.toLowerCase());
  }
  
  public get headUrl() {
    return `/static/assets/skins/${this.slug}-head.png`;
  }
  
  public get bodyUrl() {
    return `/static/assets/skins/${this.slug}-body.png`;
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
