var express = require('express');
var openid = require('openid');
var moment = require('moment');
var utils = require(__dirname + "/libs/utils");
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/app/views');
app.use('/static', express.static(__dirname + '/static'));

var Steam = new openid.RelyingParty(
  "http://localhost:3000/verify",
  "http://localhost:3000/",
  true, true, []
);

var steamOpenIDUrl = "http://steamcommunity.com/openid";
var steamApiKey = "26DE8B5C9D296C796064E890F35FA5D0";

app.get('/', function(req, res) {
  if (req.query.id) {
    utils.getUserInfo(req.query.id, steamApiKey, function (data) {
      if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response.players[0] !== "undefined") {
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
  } else {
    res.render('login', {});
  }
});

app.get('/authenticate', function(req, res) {
  Steam.authenticate(steamOpenIDUrl, false, function(err, url) {
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
        steam_id = result.claimedIdentifier.replace('http://steamcommunity.com/openid/id/', '');
        res.redirect('/?id=' + steam_id);
      }
    }
  });
});

app.get('/logout', function (req, res) {
  res.redirect('/');
});

app.listen(3000);

