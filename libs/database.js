var low = require('lowdb');

module.exports = function (callback) {
  var db = new low('db.json', {autosave: true});
  global.users = db('users');
  callback();
};