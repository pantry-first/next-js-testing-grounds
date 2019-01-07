const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const env = require('./env');
const passport = require('passport');
const knex = require('knex');
const compression = require('compression');
const cors = require('cors');
const PrettyError = require('pretty-error');
const pe = new PrettyError();

class App {
  constructor() {
    this.next = next({ dev: process.env.NODE_ENV !== 'production' });
    this.handle = this.next.getRequestHandler();
    this.server = express();
    this.db = {
      foodbank: knex({
        client: 'mysql',
        connection: {
          host: env.foodbankMysqlHost,
          user: env.foodbankMysqlUser,
          password: env.foodbankMysqlPassword,
          database: env.foodbankMysqlDatabase,
          port: env.foodbankMysqlPort
        }
      })
    };
    this.passport = passport;
    this.use(morgan('dev'));
    this.use(cookieParser());
    this.use(bodyParser.json());
    this.use(session({ secret: env.expressSessionSecret }));
    this.use(this.passport.initialize());
    this.use(this.passport.session());
    this.use(compression());
    this.use(cors({ optionsSuccessStatus: 200 }));
  }
  async init() {
    await this.next.prepare();
    await this.server.listen(env.expressPort || 3000);
  }
  get(...args) {
    this.server.get(...args);
  }
  use(plugin) {
    this.server.use(plugin);
  }
  routes(routes) {}
  logError(error) {
    console.log(pe.render(error));
  }
}

module.exports = new App();
