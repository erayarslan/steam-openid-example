var utils = require(__dirname + '/../../libs/utils');
var moment = require('moment');

module.exports.getUserById = function (req, res) {
  utils.getUserInfo(utils.ctos(req.params.id), function (data) {
    if (data !== false) {
      utils.getFriendList(utils.ctos(req.params.id), function (list) {
        var loop = list.length;
        var friends_result = [];

        if (list.length === 0) {
          res.render('profile', {
            avatar: data.avatarfull,
            date: moment(data.lastlogoff * 1000).fromNow(),
            name: data.personaname,
            location_str: data.loccountrycode + "/" + data.locstatecode,
            profile_url: data.profileurl,
            friends: [],
            moment: moment,
            utils: utils
          });
        }

        for (var i = 0; i < list.length; i++) {
          utils.getUserInfo(list[i].steamid, function (friend_info) {
            if (friend_info !== false) {
              friends_result.push(friend_info);
            }

            if (--loop === 0) {
              res.render('profile', {
                avatar: data.avatarfull,
                date: moment(data.lastlogoff * 1000).fromNow(),
                name: data.personaname,
                location_str: data.loccountrycode + "/" + data.locstatecode,
                profile_url: data.profileurl,
                friends: friends_result,
                moment: moment,
                utils: utils
              });
            }
          });
        }
      });
    } else {
      res.render('error', {content: data});
    }
  });
};