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
blog.addHook(function(item){
	item.path = item.path.toLowerCase()
})
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

	res.render('page',{
		page: article
	})
})

server.get('/blog/:article', function (req, res) {
	if(req.path !== req.path.toLowerCase()){
		return res.redirect( 301, req.path.toLowerCase() )
	}

	var articles = blog.getCollection('articles')
	var article = _.findWhere(articles,{type:'articles', path:req.params.article})

	if(!article){
		res.status(404)
		return res.render('404')
	}

	res.render('single',{
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

server.get('*', function(req, res){
	// respond with html page
	if (req.accepts('html')) {
		return res.render('404', { url: req.url });
	}

	// respond with json
	if (req.accepts('json')) {
		return res.send({ error: 'Not found' });
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});

var webhook = require('./webhook')

server.get('/webhook',webhook(blog))
server.post('/webhook',webhook(blog))

server.listen(4000)
console.log('Server running at http://localhost:4000', new Date() )