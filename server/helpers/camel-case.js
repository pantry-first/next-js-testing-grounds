const _ = require('lodash');

const cache = new Map();

function getOrSetCache(key) {
  let value = cache.get(key);
  if (value) {
    return value;
  }
  value = _.camelCase(key);
  cache.set(key, value);
  return value;
}

function camelCase(obj) {
  if (_.isNil(obj)) {
    return null;
  }
  if (_.isArray(obj)) {
    return _.map(obj, camelCase);
  }
  return _.reduce(
    obj,
    (ret, v, k) => {
      ret[getOrSetCache(k)] = v;
      return ret;
    },
    {}
  );
}

module.exports = camelCase;
