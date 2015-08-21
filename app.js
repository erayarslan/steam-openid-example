var express = require('express');
var openid = require('openid');
var moment = require('moment');
var utils = require(__dirname + "/libs/utils");
var config = require(__dirname + "/libs/config");
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use('/static', express.static(__dirname + '/static'));

var Steam = new openid.RelyingParty(config.verifyUrl, config.realm,
  true, true, []
);

app.get('/', function(req, res) {
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
        res.redirect('/' + utils.stoc(steam_id));
      }
    }
  });
});

app.get('/logout', function (req, res) {
  res.redirect('/');
});

app.get('/:id', function (req, res) {
  utils.getUserInfo(utils.ctos(req.params.id), function (data) {
    if (typeof data !== "undefined" &&
        typeof data.response !== "undefined" &&
        typeof data.response.players[0] !== "undefined") {

      data = data.response.players[0];

      res.render('profile', {
        avatar: data.avatarfull,
        date: moment(data.lastlogoff * 1000).fromNow(),
        name: data.personaname
      });
    } else {
      res.render('error', { content: data });
    }
  });
});

app.listen(3000);

