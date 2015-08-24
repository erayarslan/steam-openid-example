var baseURL = "http://localhost";

var stoc = function (s) {
  var result = [];
  for (var i = 0; i < s.length; i++) {
    result.push(String.fromCharCode(parseInt(s[i]) + 97));
  }
  return result.join('');
};
