---
title: Como combatir la fatiga de js
date: Mon May 09 2016 13:16:23 GMT-0500 (CDT)
slug: combatir-la-fatiga-de-js
description: Cada dia hay mas ruido en JS, pero es fácil de combatir y segir usando el lenguaje
image: w1rvpkz.jpg
imagePositionY: -100px
imageSize: cover
---
En el mundo de javascript, generalmente nos gusta tener librerías pequeñas o microframeworks que hagan algo bien y dejar a los equipos desarrollando aplicaciones combinar multiples microframeworks para lograr el objetivo que estamos buscando. Este enfoque da mucha flexibilidad y poder en nuestros proyectos y fue una de las cosas que mas me atrajo a Javascript y a Node.js en un principio.

Cuando migre de PHP, pasando por proyectos en RoR y llegando a Node.js deje de estar atado a un tipo de webserver, a un tipo de base de datos y a un ambiente de ejecución en especifico. Esto hacia que las primeras preguntas fueran "¿Que base de datos usar?" o "¿Como ordeno mis proyectos?", el hacerme estas preguntas me llevo a platicar con muchas personas, leer algunos libros y me convertí en mejor programador como parte de este proceso.

Al mismo tiempo de que paso este cambio era el momento donde las platicas sobre que MV* usar en frontend eran parte del día a día del mundo de javascript y había que aprender los distintos patrones de diseño que llegaban al mundo de javascript de lenguajes como Smalltalk y ambientes como .Net donde llevaban haciendo UI desde mucho tiempo antes. También había que probar las distintas implementaciones de estos patrones de diseño y entender para que funcionaban bien y para que no se debían de usar. 

En este tiempo hablábamos mucho de como aplicaciones grandes basadas en muchas aplicaciones chicas que mandaran eventos entre ellas. Sorprendentemente, esta es una manera muy elegante y sencilla de hacer UI y no solo cosas sencillas, si no aplicaciones muy complejas entre un equipo relativamente grande.

> Eran tiempos emocionantes.

El mundo de JS ha cambiado mucho desde entonces, la popularidad del lenguaje a crecido de manera rápida, la velocidad en la que salen herramientas es cada vez mayor y los requisitos de lo que debemos construir han aumentado demasiado. Esto ha hecho que mucha gente llegue al lenguaje, los buenos que llegan al lenguaje construyen nuevas librerías y propone nuevas maneras de construir aplicaciones.

Al mismo tiempo el lenguaje a pasado por un cambio del spec. Pasando del javascript que aprendi, lo que hoy se conoce como ES3 a versiones mas modernas del lenguaje como ES5 y ES6. Ahora empezamos a tener un paso en la siguiente version que es ES7. Estos cambios en el spec y tener que hacer que las versiones modernas del lenguaje corran en ambientes antiguos nos ha llevado a adoptar traspilers como un layer mas del proceso de desarrollar JS hoy en día.

Poco a poco nos vamos olvidando de la idea de pequeñas librerías que hacen una cosa bien y empiezan a surgir framework que intentan hacer resolver todo, pero a la vez no son buenos en nada. Poco a poco los programadores regresan a ser expertos en frameworks y no en el lenguaje.

Entre estos cambios hemos llegado a tener mucho ruido en el ambiente de Javascript, muchas nuevas propuestas de como hacer las cosas y muchas de estas son contradictorias entre ellas. Entre el ruido, la resistencia al cambio y la incertidumbre de no saber como hacer las cosas bien pueden llevar a un desgaste mental y hacer que la emoción de aprender y platicar sobre cosas nuevas desaparezca.

Esta [fatiga](https://medium.com/@ericclemmons/javascript-fatigue-48d4011b6fc4) que genera aprender y mantenerte al día con javascript es un problema creciente en el ecosistema de javascript y tengo que confesar que he pasado por este desgaste por algunos lapsos de tiempo en los últimos años. A la vez, pese a todo este ruido y desgaste javascript es mi lenguaje favorito para construir aplicaciones. Cada vez que me alejo del ruido y me pongo a construir cosas, recuerdo la simplicidad del lenguaje, la flexibilidad que posee y el poder que tiene adentro( y cada día tiene más poder, generators FTW!).

Tengo la suerte de haber estado expuesto a los conceptos básicos del lenguaje y haber tenido mentores que me ayudaron a aprenderlos bien. Hace poco, me ofrecieron un trabajo muy bien pagado en Angular 1.3 y me toco aprenderlo desde cero a hacer cosas que se iban a producción todos los días, esta curva de aprendizaje no fue complicada. Me tomo un par de horas llegar a la conclusion que Angular era un MVVM, donde los Servicios son los Modelos y las Directivas son las Vistas. Trabajar en el proyecto fue familiar a otro proyectos, pese a tener un framework nuevo sobre las mismas bases de siempre.

A la vez, no le hubiera deseado pasar por esa situación a alguien sin las bases correctas y probablemente el resultado hubiera sido muy mal código que alguien hubiera tenido que mantener por mucho tiempo.

Los pasos que me llevaron a amar este lenguaje son sencillos, hay que aprender que es una función, que es un contexto, que es un evento, que es el eventloop, como manejar cosas asíncronas y que patrones de diseño existen en el contexto en el que estamos trabajando. Les recomiendo a todos los que estén trabajando con JS y no conozcan estos conceptos que los empiecen a aprender en su tiempo libre.

Si no regresamos a hablar de las bases del lenguaje, si no regresamos a tener las platicas de los patrones de diseño importantes en javascript regresaremos a la antigua queja de "La gente aprende jQuery y no aprende javascript", con el pequeño twist de que ya no es jQuery si no una librería/framework nuevo y la curva de aprendizaje de JS sera cada día más complicada de entender para la gente que va llegando al lenguaje.

