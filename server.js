var express = require('express'),
	Paperpress = require('paperpress').Paperpress,
	logger = require('morgan'),
	swig = require('swig'),
	_ = require('underscore')

var feedDescription = require('./feed-description')

var server = express();

server.use(logger(':status :req[x-real-ip] :method :response-time ms :url'));

server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', __dirname + '/views');
server.set('view cache', false);
swig.setDefaults({ cache: false });

var blog = new Paperpress({
	// directory : 'static',
	// themePath : 'static/themes/base',
	// basePath  : '/blog',
	// articlesPerPage : 20,
	// pagesPath : ''
	uriPrefix: '/blog'
});
blog.load()

server.use(express.static('public'))

server.get('/', function (req, res) {
	res.redirect('/blog')
})

server.get('/blog', function (req, res) {
	var articles = blog.getCollection('articles')

	res.render('multiple',{
		articles: articles
	})
})

server.get('/info', function(req, res) {
	var article = _.findWhere(blog.items,{type:'pages', slug:'info'})

	res.render('single',{
		article: article
	})
})

server.get('/blog/:article', function (req, res) {
	var articles = blog.getCollection('articles')
	var article = _.findWhere(articles,{type:'articles', slug:req.params.article})

	res.render('page',{
		article: article
	})
})

server.get('/feed', function (req, res) {
	res.redirect('/rss')
})

server.get('/rss', function (req, res) {
	// res.send('hi')
	var articles = blog.getCollection('articles')
	articles.forEach((item)=>{
		item.suggestedUri = '/blog/' + item.slug
	})

	var feed = Paperpress.helpers.createFeed(feedDescription, articles)

	res.set('Content-Type', 'text/xml');
	res.send(feed.render('rss-2.0'));	
})

var webhook = require('./webhook')

server.get('/webhook',webhook(blog))
server.post('/webhook',webhook(blog))

server.listen(4000)
console.log('Server running at http://localhost:4000', new Date() )