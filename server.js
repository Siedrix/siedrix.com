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
	uriPrefix: '/blog',
	pathBuilder: function(item, collectionName){
		if(collectionName === 'articles'){
			return '/blog/'+item.slug
		}else if(collectionName === 'bubbles'){
			return '/reflexiones-diarias/'+item.slug
		}else if(collectionName === 'pages'){
			return '/'+item.slug
		}
	}
});
blog.addHook(function(item){
	item.slug = item.slug.toLowerCase()
})
blog.load()

blog.items.forEach(function(item){
	console.log('=>', item.path)
})

server.use(express.static('public'))

server.get('/', function (req, res) {
	res.redirect('/blog')
})

server.get('/info', function(req, res) {
	var article = _.findWhere(blog.items,{type:'pages', slug:'info'})

	res.render('page',{
		page: article
	})
})

server.get('/blog', function (req, res) {
	var articles = blog.getCollection('articles')

	articles.forEach((item) => {
		item.link = '/blog/' + item.slug
	})

	res.render('multiple',{
		articles: articles
	})
})

server.get('/blog/:article', function (req, res) {
	if(req.path !== req.path.toLowerCase()){
		return res.redirect( 301, req.path.toLowerCase() )
	}

	var articles = blog.getCollection('articles')
	var article = _.findWhere(articles,{path:req.path})

	if(!article){
		res.status(404)
		return res.render('404')
	}

	res.render('single',{
		article: article
	})
})

server.get('/reflexiones-diarias', function (req, res) {
	var bubbles = blog.getCollection('bubbles')

	bubbles.forEach((item) => {
		item.link = '/reflexiones-diarias/' + item.slug
	})	

	res.render('multiple',{
		articles: bubbles
	})
})

server.get('/reflexiones-diarias/:slug', function (req, res) {
	if(req.path !== req.path.toLowerCase()){
		return res.redirect( 301, req.path.toLowerCase() )
	}

	var bubbles = blog.getCollection('bubbles')
	var buble = _.findWhere(bubbles,{path:req.path})

	if(!buble){
		res.status(404)
		return res.render('404')
	}

	res.render('single',{
		article: buble
	})
})

server.get('/feed', function (req, res) {
	res.redirect('/rss')
})

server.get('/rss', function (req, res) {
	// res.send('hi')
	var articles = blog.getCollections(['articles', 'bubbles'])
	articles.forEach((item)=>{
		item.link = item.suggestedPath
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