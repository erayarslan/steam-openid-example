var request = require("request");
var config = require(__dirname + "/config");

var stoc = function (s) {
  var result = [];
  for (var i = 0; i < s.length; i++) {
    result.push(String.fromCharCode(parseInt(s[i]) + 97));
  }
  return result.join('');
};

var ctos = function (c) {
  var result = [];
  for (var i = 0; i < c.length; i++) {
    result.push(c[i].charCodeAt(0) - 97);
  }
  return result.join('');
};

module.exports = {
  getUserInfo : function (id, callback) {
    request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + config.steamApiKey + '&steamids=' + id, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(JSON.parse(body));
      } else {
        callback(body);
      }
    });
  },
  stoc: stoc,
  ctos: ctos,
  secure: function (req, res, next) {
    var done = users.find(function (obj) {
      return obj.token === req.cookies.token;
    });

    if (typeof done === "undefined") {
      res.clearCookie("token").redirect("/");
    } else {
      req.user = done;
      next();
    }
  },
  ness: function (req, res, next) {
    var done = users.find(function (obj) {
      return obj.token === req.cookies.token;
    });

    if (typeof done === "undefined") {
      res.clearCookie("token");
      next();
    } else {
      req.user = done;
      res.redirect("/" + stoc(done.steam_id));
    }
  }
};
