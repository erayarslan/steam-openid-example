var utils = require(__dirname + '/../../libs/utils');
var moment = require('moment');

module.exports.profile = function (req, res) {
  utils.getUserInfo(utils.ctos(req.params.id), function (data) {
    if (data !== false) {
      utils.getFriendList(utils.ctos(req.params.id), function (friends) {
        res.render('profile', {
          avatar: data.avatarfull,
          date: moment(data.lastlogoff * 1000).fromNow(),
          name: data.personaname,
          country: typeof data.loccountrycode !== "undefined" ? data.loccountrycode : "?",
          state: typeof data.locstatecode !== "undefined" ? data.locstatecode : "?",
          profile_url: data.profileurl,
          friends: JSON.stringify(friends),
          moment: moment,
          utils: utils
        });
      });
    } else {
      res.render('error', {content: data});
    }
  });
};

module.exports.getUserBySteamId = function (req, res) {
  utils.getUserInfo(req.params.id, function (data) {
    if (data !== false) {
      res.json({type: "success", message: data});
    } else {
      res.json({type: "error", message: "not_found"});
    }
  });
};
