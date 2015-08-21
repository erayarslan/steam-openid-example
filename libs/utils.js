var request = require("request");
var config = require(__dirname + "/config");

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
  stoc: function (s) {
    var result = [];
    for (var i = 0; i < s.length; i++) {
      result.push(String.fromCharCode(parseInt(s[i]) + 97));
    }
    return result.join('');
  },
  ctos: function (c) {
    var result = [];
    for (var i = 0; i < c.length; i++) {
      result.push(c[i].charCodeAt(0) - 97);
    }
    return result.join('');
  }
};
