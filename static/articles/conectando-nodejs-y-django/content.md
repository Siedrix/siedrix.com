Uno de los problemas más comunes a resolver hoy en día es que cuando pase una acción en nuestras aplicaciones necesitamos actualizar el UI de varias páginas, en varios dispositivos, para mostrar que dicha acción ha sido realizada a las distintas personas que les importa la acción, mandar notificaciones por email y guardar logs de lo que hacemos. 

Para resolver este problema una de las ideas sugeridas es utilizar una arquitectura de microservicios como la que propone Martin Foller en este [blogpost](http://martinfowler.com/articles/microservices.html). En términos abstractos esta arquitectura implica hacer muchas pequeñas aplicaciones que trabajen en conjunto, en vez de hacer una aplicación monolítica. 

Esto agrega un nivel de complejidad al necesitar comunicar muchos microservicios ya sea por algún servicio de canal de comunicación( como RabbitMq o Redis) o tener un endpoint(como un API RESTfull) para cada módulo y que monitorear muchos más servidores corriendo en producción. 

A su vez, la idea de tener una arquitectura de microservicios tiene muchas ventajas, principalmente utilizar la mejor herramienta para cada problema; tener muchos microservicios es bastante más mantenible que tener un sólo servicio monolítico, ya que puedes tener un equipo asignado a cada servicio y tener responsables del sistema o actualizar dependencias poco a poco, como explica la gente de [YourKarma](https://blog.yourkarma.com/building-microservices-at-karma).

El artículo de Martin Foller es muy bueno y les recomiendo que lo lean, porque va a mucho más detalle de lo explicado en este par de párrafos.

La idea de microservicios es una muy buena noticia para node.js, por 3 grandes razones:

- Node.js tiene la mejor librería de websocket en el mercado (probablemente las mejores 3) por lo cual siempre habrá algo que hacer en node.js en el proyecto.
- Node.js todavia no tiene un framework como RoR o Django para hacer aplicaciones, pero para hacer microservicios con express/mongoose es mas mas que suficiente, entonces puede que nunca necesitemos un framework para hacer aplicaciones monolíticas en Nodejs.
- Usando Redis es bastante fácil conectar NodeJs a otros microservicios, como veremos en este artículo.

En lo que queda del resto de este blogpost trataré de explicarles los conceptos básicos que implica conectar un servicio de Nodejs con un canal de comunicación proporcionado por Redis y cómo mandar mensajes a este canal de comunicación desde Python. Una vez entendidos los conceptos básicos es bastante fácil conectar muchos servicios más allá del caso de websockets que mostraré en el ejemplo.

### Herramientas a usar

Este problema no es un problema tan trivial como un CRUD, pero por suerte las herramientas que necesitamos para resolver este problema ya están disponibles hoy en día, de manera open source y en gran cantidad. Muchas de estas herramientas hasta tienen buena documentación.
El primer paso implica dividir nuestra aplicación en distintos servicios que operen de manera conjunta. Para este blogpost: 

Usaré Python para iniciar la notificación a los demás servicios, asumiendo que antes de esto hubiéramos realizado alguna acción importante de nuestra aplicación.
Tendremos Redis para proporcionar el canal de comunicación.
node.js para distribuir la notificación por websockets a múltiples browsers y dispositivos móviles usando la librería de socket.io.

Como nota importante, la parte de Python, puede ser reemplazada por líneas muy parecidas de Ruby, PHP o Go. Mandar notificaciones por socket.io puede ser fácilmente reemplazado por un servicio que haga logs de las acciones en nuestra aplicación o mandar emails después de cada acción; hasta podrían tener los 3 trabajando al mismo tiempo.

### PubSub con Redis

La opción más fácil que he encontrado para integrar varios servicios de esta manera se basa en un patrón llamado PubSub y una herramienta llamada Redis. Si necesitan algo más robusto podrían checar RabbitMQ, aunque muchas veces Redis es todo lo que necesitan.

PubSub implica dos conceptos muy sencillos, el primero —Pub— implica que vas a tener distintos canales a los cuales puedes publicar un mensaje, mientras que el segundo —Sub— implica que puedes suscribirte a un canal y escuchar cada mensaje que sea publicado en este canal. Como tal, el concepto de PubSub es bastante sencillo pero a la vez bastante poderoso, porque podrás tener distintos canales para cada tipo de acción en tu aplicación y podrás tener múltiples servicios escuchando en cada canal y que cada servicio tenga tareas muy sencillas que realizar con cada mensaje.

Redis, entre las muchas cosas que puede hacer, tiene la funcionalidad de PubSub integrada y nos permitirá implementar una manera muy sencilla de mantener múltiples canales de comunicación disponibles a los cuales el API pueda mandar la información y node.js escuchará los mensajes para después procesarlos.

 Redis maneja los mensajes como strings, pero es mucho mas útil tenerlos en JSON, para poder pasar una estructura del mensaje mucho mas completa; para esto, se requiere hacer un paso extra y cambiar el mensaje de JSON a string y de string a JSON cuando va llegando a nuestra aplicación. <serializar y deserializar serían una mejor construcción de esta última oración?>

Nota: Si no conoces Redis probablemente el primer acercamiento a este te cueste trabajo, ya que es una navaja suiza disfrazada de base de datos y hoy sólo usaremos un pequeño pedazo de lo que puede lograr. Te recomiendo darle una checada, hará tu vida más sencilla.

### Servicio de API en Python

Imaginemos que ya creaste tu registro de tipo en la base de datos con tu ORM de confianza en Python y deseas notificar a los demás servicios de que el registro ha sido creado.
En el lado de nuestro API tendremos un que crear un cliente de Redis

```
import redis

r = redis.Redis()
```

Después habrá que crear el mensaje en un diccionario de python y convertirlo en un string que tenga json adentro

```
import json
message = {
    "title" : "Hello world",
    "content" : "Welcome to this blog"
}

messageAsStr = json.dumps(message)
```

Una vez que tenemos la conexión a Redis creada y el mensaje como string, lo único que es necesario es publicar el mensaje a un canal llamado blogpost.

```
r.publish("blogpost", messageAsStr)
```

### Servicio de Nodejs

De esta manera el mensaje ha sido enviado por Redis y sólo falta tener alguien del otro lado esperando escuchar este mensaje. Para hacer esto requerimos hacer un cliente de Redis del lado de Nodejs.

```
var redis = require('redis');
var r = redis.createClient();
```

El siguiente paso es declarar a que canales queremos suscribirnos. En este caso sólo nos suscribiremos a un solo canal, pero pueden repetir esta instrucción muchas veces y subscribirse a todos los canales que se necesiten.

```
r.subscribe('blogpost');
```

Una vez que esté suscrito al canal, tenemos que tener un listener como hacemos en jQuery al click de un botón.

```
r.on('message', function(channel, messageStr){
    var message = JSON.parse(messageStr);

    io.emit(channel, message);
});
```

Lo que hace esta función es tomar cualquier mensaje que te llegue y publicarlo a todos los sockets. En algún blogpost futuro hablaré un poco de como hacer canales de websockets para cada usuario y tener un poco mas de control sobre la información que ve cada usuario. Si quieres que escriba este blogpost, recuérdamelo en @siedrix.

### Wrapping it up

Como puedes ver, la cantidad de líneas que he utilizado para describir el problema y las herramientas que hemos utilizado es mucho mayor a la cantidad de líneas de código que se necesitan para resolver el problema.
La parte complicada que yo tuve al pasar de servicios monolíticos que hacía en ZendPHP a muchos servicios pequeños fue cambiar la manera de pensar, por suerte esto es parte de la idea central de la comunidad de javascript que se basa en hacer cosas pequeñas que hagan una sola cosa y que sean lo más adecuadas para resolver este problema. (Si, ya sé, esta idea es la filosofía de UNIX, pero no la conocí hasta llegar a Node.js).

Nota Si tienes problemas checando qué mensajes se han pasado a Redis, utiliza redis-cli monitor en terminal, para tener un log de todos los mensajes que se van publicando por los distintos canales que tienes en tu aplicación.

