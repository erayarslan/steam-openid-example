var openid = require('openid');
var config = require(__dirname + '/../../libs/config');
var randomToken = require('rand-token');
var Steam = new openid.RelyingParty(
  config.verifyUrl,
  config.realm,
  true,
  true,
  []
);

module.exports.home = function (req, res) {
  res.render('login', {});
};

module.exports.authenticate = function (req, res) {
  Steam.authenticate(config.steamOpenIdUrl, false, function (err, url) {
    if (err) {
      res.render('error', {content: 'Authentication failed: ' + err});
    } else {
      if (!url) {
        res.render('error', {content: 'Authentication failed.'});
      } else {
        res.redirect(url);
      }
    }
  });
};

module.exports.verify = function (req, res) {
  Steam.verifyAssertion(req, function (err, result) {
    if (err) {
      res.send(err).end();
    } else {
      if (!result || !result.authenticated) {
        res.render('error', {content: 'Failed to authenticate user.'});
      } else {
        steam_id = result.claimedIdentifier.split('/')[5];

        var done = users.find(function (obj) {
          return obj.steam_id === steam_id;
        });

        var newToken = randomToken.generate(32);

        if (typeof done !== 'undefined') {
          done.token = newToken;
        } else {
          users.push({
            steam_id: steam_id,
            token: newToken
          });
        }

        res.cookie('token', newToken).redirect("/");
      }
    }
  });
};

module.exports.logout = function (req, res) {
  var done = users.find({steam_id: req.user.steam_id});
  done.token = randomToken.generate(32);
  res.clearCookie('token').redirect('/');
};

module.exports.default = function (req, res) {
  res.render('error', {content: '404'});
};