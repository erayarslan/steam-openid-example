var request = require("request");

module.exports = {
  getUserInfo : function (id, apiKey, callback) {
    request('http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + apiKey + '&steamids=' + id, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        callback(JSON.parse(body));
      } else {
        callback(body);
      }
    });
  }
};
