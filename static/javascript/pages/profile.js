var profile = function (friends) {
  var result_html = [];

  friends = JSON.parse(friends);

  var loop = friends.length;
  var inc = 1/friends.length;

  NProgress.set(0.0);

  for (var i in friends) {
    $.get(baseURL + "/ajax/user/" + friends[i].steamid, function (data) {
      if (data.type === "success") {
        var html = '<p><a href="/' + stoc(data.message.steamid) + '">' + data.message.personaname + '</a></p>';
        result_html.push(html);

        NProgress.inc(inc);

        if (--loop === 0) {
          $("#friends").html(result_html.join(''));
          NProgress.set(1.0);
        }
      }
    });
  }
};
