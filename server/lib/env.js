const _ = require('lodash');

module.exports = _.assign(
  {
    expressSessionSecret: '',
    expressPort: 3000
  },
  _.reduce(
    require('dotenv').config().parsed,
    (config, value, key) => {
      config[_.camelCase(key)] = value;
      return config;
    },
    {}
  )
);
