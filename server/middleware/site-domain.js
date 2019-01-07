const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { parse: parseUrl, UrlWithParsedQuery } = require('url');

const App = require('../lib/app');
const cache = require('../cache');
const SiteDomain = require('../models/site-domain');

const basePath = path.join(path.dirname(__dirname), 'public');
const primaryRobotTXT = fs.readFileSync(
  path.join(basePath, 'primary', 'robots.txt')
);
const secondaryRobotTXT = fs.readFileSync(
  path.join(basePath, 'secondary', 'robots.txt')
);

module.exports = async (req, res, next) => {
  // get domain
  if (/^\/_next/.test(req.url)) {
    return next();
  }
  try {
    res.locals.domain = await cache.getOrSet(req.hostname, () =>
      SiteDomain.findOne({ hostname: req.hostname })
    );

    if (!res.locals.domain) {
      return App.next.render404(req, res);
    }
    if ('/robots.txt' === req.url) {
      res.type('text/plain');
      return res.send(
        res.locals.domain.isPrimary === 1 ? primaryRobotTXT : secondaryRobotTXT
      );
    }
    await next();
  } catch (error) {
    const url = req.url;
    const { pathname, query } = parseUrl(url, true);
    App.logError(error);

    res.statusCode = 500;
    if (req.method === 'GET' || req.method === 'HEAD') {
      return await App.next.renderError(null, req, res, '/_error', {});
    } else {
      return res.end('Something went wrong');
    }
  }
};
