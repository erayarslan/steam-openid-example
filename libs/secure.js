var utils = require(__dirname + '/utils');

module.exports = {
	secure: function (req, res, next) {
    var done = users.find(function (obj) {
      return obj.token === req.cookies.token;
    });

    if (typeof done === 'undefined') {
      res.clearCookie('token').redirect('/');
    } else {
      req.user = done;
      next();
    }
  },
  ness: function (req, res, next) {
    var done = users.find(function (obj) {
      return obj.token === req.cookies.token;
    });

    if (typeof done === 'undefined') {
      res.clearCookie('token');
      next();
    } else {
      req.user = done;
      res.redirect('/' + utils.stoc(done.steam_id));
    }
  }
}