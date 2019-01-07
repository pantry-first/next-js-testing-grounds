const App = require('../../lib/app');
const camelCase = require('../../helpers/camel-case');
const _ = require('lodash');

module.exports = {
  TABLE: 'sites_domains',
  async find(filters) {
    const query = App.db.foodbank(this.TABLE);

    if (filters.hostname) {
      query.where(`${this.TABLE}.hostname`, filters.hostname);
    }
    const res = await query;
    return camelCase(res);
  },
  async findOne(filters) {
    return _.first(await this.find(filters));
  }
};
