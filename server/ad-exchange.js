const fetch = require('node-fetch');

fetch('https://api.github.com/users/github')
  .then(res => res.price_usd);

module.exports = {
  value_of_coin(total_usd_earned, total_num_coins) {
    return total_usd_earned / total_num_coins;
  },

  earned_from_coin(total_shares, total_xmr) {
    const total_usd = total_xmr * price_usd;
    const usd_per_share = total_usd / total_shares;
    return total_usd;
  },

  earned_from_ads(total_num_impr, usd_per_impr) {
    return total_num_impr * usd_per_impr;
  },

  total_usd_earned(earned_from_coin, earned_from_ads) {
    return earned_from_coin + earned_from_ads;
  }
};
