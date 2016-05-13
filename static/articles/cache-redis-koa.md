---
title: Cache con Redis en Koa
date: Fri May 13 2016 10:50:22 GMT-0500 (CDT)
slug: cache-redis-koa
description: Aprende como agregar cache a un app de Koa. Es muy sencillo.
image: nBqCMwYS.jpg
imagePositionY: 0px
imageSize: cover
---
En la última semana he estado haciendo cosas que implican tener un server que pide JSON a otro server, manipular un poco el JSON y entregarlo por el API. Como parte de este proceso decidí agregarle un layer de cache por que el segundo server que me da el JSON puede tardar bastante en algunos casos. 

Para este punto, probablemente todos deberían saber lo mucho que me gusta Redis, es una navaja suiza y si Redis hace algo, probablemente lo hará mejor que tu implementación desde cero. Permite tener sesiones en Nodejs, [conectar múltiples servicios por medio de pubsub](/blog/conectando-servicios-a-node.js) y también permite agregar cache a tu aplicación bastante fácil.

Había trabajado algo similar en par de apps de [Express](expressjs.com) y ahora que lo intente en [Koa](koajs.com) me di cuenta que sus middleware son mucho mas poderosos y tienen mucha mas flexibilidad. En un middleware de express en el momento que llamas `next()` se ejecuta el siguiente middleware y este middleware dejaba de ser parte del request. En el caso de Koa esto es distinto, tienes la libertad de ejecutar `next` esperar a que ejecuten todos las demás funciones que pertenecen a ese url handler y después todavía puedes ejecutar código. 

Por ejemplo este middleware checa cuanto tiempo toma en procesar un request:

```
app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
```

De esta manera podemos agregar un middleware que revise si tenemos la información en cache. En caso de que no lo en cache, hacer `yield next` para conseguir el JSON y después de tener el resultado, guardarlo en el cache.

Pasaremos a la parte de guardar cosas en cache y después terminamos de armar nuestro middleware. Para esto necesitaran agregar el paquete de [Redis](https://github.com/NodeRedis/node_redis) para node a su proyecto con `npm install -S redis` y crear un cliente con:

```
const redis = require("redis")
const client = redis.createClient()
```

Para guardar cosas en cache en Redis tenemos un comando muy útil llamado Setex, un set con tiempo de expiración. En el cual le ponemos un valor a una llave y pasar cuantos segundos queremos que viva en el cache(timeToLive). Para la llave usaremos el path que estamos pidiendo y como Redis solo puede guardar strings, entonces tendremos que pasar nuestro JSON a string. Terminando con esta linea de código:

```javascript
client.setexAsync(key, timeToLive, value)
```

Para recuperar un valor que esta guardado en Redis es aun mas sencillo, tenemos un comando llamado get que permite recuperar el valor en una llave. Este valor existirá por un el tiempo que decidimos tener en la variable timeToLive en caso de que no get regrese null, es que no tenemos un valor guardado en cache, en caso de que regrese un string implica que tenemos un valor guardado en cache.

```
var cacheBody = yield client.getAsync(key)
```

Regresando a nuestro middleware tenemos que hacer un generator que pida la llave correcta al cache, después cheque si tiene algún valor en cache y en caso de que lo tenga, pasarlo a JSON y regresarlo. Si no lo tiene procesara el request de manera normal y después tendremos que guardarlo en cache. Lo cual nos genera este código:
```
const timeToLive = 60
const cacheMiddleware = function *(next){
        var cacheBody = yield client.getAsync(this.request.path)
        if(cacheBody){
                console.log('Using cache body', this.request.path)
                return this.body = JSON.parse(cacheBody)
        }else{
                console.log('Requesting to reddit', this.request.path)
        }

        yield next
        
        client.setexAsync(this.request.path, timeToLive, JSON.stringify(this.body) )
}
```

Que podemos usar en cualquier url handler. Solamente tienen el middleware antes de la función(es) que procesan el request de esta manera:
```
router.get('/r/:subreddit', cacheMiddleware, function *(next) {
        var body = yield request({
                uri: 'https://www.reddit.com/r/'+this.params.subreddit+'.json',
                json: true
        })

        this.body = body
})
```

Si quieren ver los ejemplos completos pueden descargarlos de este [gist](https://gist.github.com/Siedrix/a46a1f37238139adbe07fc04e9468f5b).

Espero que esto les ayude a poner cache a sus aplicaciones de manera sencilla y lograr mejorar el tiempo de respuesta para tener usuarios mas felices. Si quieren mejorar a este articulo o mandar comentarios, no duden contactarme por twitter.

Nota: En este ejemplo estuve usando Koa 1.x y cambian bastante las cosas para 




