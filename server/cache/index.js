const _ = require('lodash');
const cache = new Map();
const dateFns = require('date-fns');

const TTL = 300;

module.exports = {
  clear(key) {
    if (cache.has(key)) {
      cache.delete(key);
    }
  },
  getOrSet(key, cb, ttl = TTL) {
    const item = cache.get(key);
    const eventTime = new Date();
    let value = item && item.value;
    if (!item || (item && item.expires < eventTime)) {
      value = cb().catch(e => {
        if (item) {
          cache.set(key, {
            expires: dateFns.addMilliseconds(eventTime, ttl || TTL),
            value: item.value
          });
          return item.value;
        } else {
          cache.delete(key);
          throw e;
        }
      });
      cache.set(key, {
        expires: dateFns.addMilliseconds(eventTime, ttl || TTL),
        value
      });
    }

    return (item && item.value) || value;
  }
};
