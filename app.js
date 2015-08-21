var express = require('express');
var openid = require('openid');
var app = express();

var Steam = new openid.RelyingParty(
  "http://localhost:3000/verify",
  "http://localhost:3000/",
  true, true, []
);

var steamOpenIDUrl = "http://steamcommunity.com/openid";

app.get('/', function(req, res) {
  var loginTemplate = "<a href='/authenticate'><img src='https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png'></a>";
  if (req.query.id) {
    res.send("welcome " + req.query.id).end();
  } else {
    res.send(loginTemplate);
  }
});

app.get('/authenticate', function(req, res) {
  Steam.authenticate(steamOpenIDUrl, false, function(err, url) {
    if(err) {
      res.send('Authentication failed: ' + err).end();
    } else {
      if(!url) {
        res.send('Authentication failed.').end();
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
        res.send('Failed to authenticate user.').end();
      } else {
        steam_id = result.claimedIdentifier.replace('http://steamcommunity.com/openid/id/', '');
        res.redirect('/?id=' + steam_id);
      }
    }
  });
});

app.listen(3000);

