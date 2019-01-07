const passport = require('passport');

module.exports = App => {
  // App.get('/logout', function(req, res) {
  //   req.logout();
  //   res.redirect('/');
  // });

  // App.post('/register', async (req, res) => {})
  // App.post('/login', passport.authenticate('local'), async (req, res) => {
  // });

  // render next js SSR
  App.get('*', (req, res) => {
    return App.handle(req, res);
  });
};
