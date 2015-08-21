var express = require('express');
var openid = require('openid');
var moment = require('moment');
var utils = require(__dirname + "/libs/utils");
var app = express();

var Steam = new openid.RelyingParty(
  "http://localhost:3000/verify",
  "http://localhost:3000/",
  true, true, []
);

var steamOpenIDUrl = "http://steamcommunity.com/openid";
var steamApiKey = "";

app.get('/', function(req, res) {
  var loginTemplate = "<a href='/authenticate'><img src='https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png'></a>";
  if (req.query.id) {
    utils.getUserInfo(req.query.id, steamApiKey, function (data) {
      if (typeof data !== "undefined" && typeof data.response !== "undefined" && typeof data.response.players[0] !== "undefined") {
        data = data.response.players[0];
        res.send("<img src='" + data.avatarfull + "'/><hr/><h2>last online: " + moment(data.lastlogoff * 1000).fromNow() + "</h2>").end();
      } else {
        res.send(data).end();
      }
    });
  } else {
    res.send(loginTemplate).end();
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

