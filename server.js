var express = require('express'),
	Paperpress = require('paperpress').Paperpress,
	logger = require('morgan');

var server = express();

server.use(logger(':status :req[x-real-ip] :method :response-time ms :url'));

var blog = new Paperpress({
	directory : 'static',
	themePath : 'static/themes/base',
	basePath  : '/blog',
	articlesPerPage : 20,
	pagesPath : ''
});

blog.attach(server);

server.get('/', function (req, res) {
	res.redirect('/blog');
});

server.get('/feed', function (req, res) {
	res.redirect('/rss');
});

var webhook = require('./webhook');

server.get('/webhook',webhook(blog));
server.post('/webhook',webhook(blog));

server.listen(4000);
console.log('Server running at http://localhost:4000', new Date() );