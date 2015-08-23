var baseURL = "http://localhost";

var stoc = function (s) {
  var result = [];
  for (var i = 0; i < s.length; i++) {
    result.push(String.fromCharCode(parseInt(s[i]) + 97));
  }
  return result.join('');
};

var profile = function (friends) {
  var friends = JSON.parse(friends);
  for (var i in friends) {
    $.get(baseURL + "/ajax/user/" + friends[i].steamid, function (data) {
      if (data.type === "success") {
        var html = '<p><a href="/' + stoc(data.message.steamid) + '">' + data.message.personaname + '</a></p>';
        $("#friends").append(html);
      }
    });
  }
};
