var secure = require(__dirname + '/secure');
var home = require(__dirname + '/../app/controllers/home');
var user = require(__dirname + '/../app/controllers/user');

var express = require('express');
var app = express();

app.use(require('cookie-parser')());
app.use('/static', express.static(__dirname + '/../static'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../app/views');

app.get('/', secure.ness, home.home);
app.get('/authenticate', secure.ness, home.authenticate);
app.get('/verify', secure.ness, home.verify);
app.get('/logout', secure.secure, home.logout);
app.get('/:id', secure.secure, user.getUserById);
app.get('*', home.default);

app.listen(3000);
