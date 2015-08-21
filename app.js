var express = require('express');
var cookieParser = require('cookie-parser');
var openid = require('openid');
var moment = require('moment');
var utils = require(__dirname + "/libs/utils");
var config = require(__dirname + "/libs/config");
var low = require('lowdb');
var randomToken = require('rand-token');

var db = new low('db.json', {autosave: true});
global.users = db('users');
var app = express();

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use('/static', express.static(__dirname + '/static'));

var Steam = new openid.RelyingParty(config.verifyUrl, config.realm,
  true, true, []
);

app.get('/', utils.ness, function(req, res) {
  res.render('login', {});
});

app.get('/authenticate', function(req, res) {
  Steam.authenticate(config.steamOpenIdUrl, false, function(err, url) {
    if(err) {
      res.render('error', { content: 'Authentication failed: ' + err });
    } else {
      if(!url) {
        res.render('error', { content: 'Authentication failed.'});
      } else {
        res.redirect(url);
      }
    }
  });
});

app.get('/verify', function(req, res) {
  Steam.verifyAssertion(req, function(err, result) {
    if(err) {
      res.send(err).end();
    } else {
      if(!result || !result.authenticated) {
        res.render('error', { content: 'Failed to authenticate user.' });
      } else {
        steam_id = result.claimedIdentifier.split('/')[5];

        var done = users.find(function (obj) {
          return obj.steam_id === steam_id;
        });

        var newToken = randomToken.generate(32);

        if (typeof done !== "undefined") {
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
});

app.get('/logout', utils.secure, function (req, res) {
  var done = users.find({ steam_id: req.user.steam_id });
  done.token = randomToken.generate(32);
  res.clearCookie("token").redirect("/");
});

app.get('/:id', utils.secure, function (req, res) {
  utils.getUserInfo(utils.ctos(req.params.id), function (data) {
    if (typeof data !== "undefined" &&
        typeof data.response !== "undefined" &&
        typeof data.response.players[0] !== "undefined") {

      data = data.response.players[0];

      res.render('profile', {
        avatar: data.avatarfull,
        date: moment(data.lastlogoff * 1000).fromNow(),
        name: data.personaname,
        location_str: data.loccountrycode + "/" + data.locstatecode,
        profile_url: data.profileurl
      });
    } else {
      res.render('error', { content: data });
    }
  });
});

app.listen(3000);

