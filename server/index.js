const App = require('./lib/app');

const ReactRoute = require('./routes/react');

(async () => {
  try {
    await App.init();
    App.use(require('./middleware/site-domain'));
    // load Routes
    ReactRoute(App);
  } catch (e) {
    console.error(e);
  }
})();
