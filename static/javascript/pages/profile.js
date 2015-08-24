var profile = function (friends) {
  $('.chatter_convo').scrollTop($('.chatter_convo')[0].scrollHeight);

  var result_html = [];

  friends = JSON.parse(friends);

  var loop = friends.length;
  var inc = 1 / friends.length;

  NProgress.set(0.0);

  if (loop === 0) {
    $("#friends").html(result_html.join(''));
    NProgress.set(1.0);
  }

  for (var i in friends) {
    $.get(baseURL + "/ajax/user/" + friends[i].steamid, function (data) {
      if (data.type === "success") {
        var html = '<div class="box"><a href="/' + stoc(data.message.steamid) + '" title="' + data.message.personaname + '"><img height="100" width="100" src="' + data.message.avatarfull + '"/></a></div>';
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
