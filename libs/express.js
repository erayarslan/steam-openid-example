var secure = require(__dirname + '/secure');
var home = require(__dirname + '/../app/controllers/home');
var user = require(__dirname + '/../app/controllers/user');

var express = require('express');
var app = express();

app.use(require('cookie-parser')());
app.use('/static', express.static(__dirname + '/../static'));
app.use(require('serve-favicon')(__dirname + '/../static/favicon.ico'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../app/views');

app.get('/', secure.NotNeedAuth, home.home);
app.get('/authenticate', secure.NotNeedAuth, home.authenticate);
app.get('/verify', secure.NotNeedAuth, home.verify);
app.get('/logout', secure.NeedAuth, home.logout);
app.get('/:id', secure.NeedAuth, user.profile);
app.get('/ajax/user/level/:id', secure.NeedAuth, user.getLevelBySteamId);
app.get('/ajax/user/:id', secure.NeedAuth, user.getUserBySteamId);
app.get('*', home.default);

app.listen(80);
