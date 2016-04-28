El 22 de abril Chris Vickery, investigador de MacKeeper, reveló que había una copia del padrón electoral mexicano en una base de datos de MongoDB que no contaba con medidas de autenticación o password para protegerla en un servidor de Amazon AWS y comentó que había notificado a las autoridades correspondientes para hacer que esta lista dejará de estar disponible. También reveló que había encontrado esta base de datos usando un servicio llamado Shodan.

Desde el blog de mackeeper:
> [Before going any further, let’s make one thing very clear. I’m not the one who transmitted the data out of Mexico. Someone else will have to answer for that. However, eight days ago (April 14th), I did discover a publicly accessible database, hosted on an Amazon cloud server, containing these records. There was no password or authentication of any sort required. It was configured purely for public access. Why? I have no clue.](https://mackeeper.com/blog/post/217-breaking-massive-data-breach-of-mexican-voter-data)

Desde el motherboard de vice:
> [In the morning of April 14, Chris Vickery, a security researcher, was browsing Shodan, a search engine for internet-connected devices and servers, when he noticed an unusually large database of more than 100 gigabytes on an Amazon cloud storage called “padron2015.”](http://motherboard.vice.com/read/how-a-hacker-found-the-personal-information-of-all-mexican-voters)

Ayer se descubrió que la base de datos fue dada al partido Movimiento Ciudadano y estos con consultora llamada Indatcom habían subido a AWS. Movimiento Ciudadano en un intento de lavarse las manos comenta que el servidor fue víctima de “ataque cibernético“ y que ellos no tienen la culpa de esta filtración, si no que fue una acto ilegal en contra de ellos.

Lo primero que hay que tomar en cuenta es que si los datos no tenían protección alguna y estaban disponibles al público, esto no es un caso de ataque cibernético. Segundo no se usaron herramientas sofisticadas para violar las medidas de seguridad en el servidor, por que estas eran inexistentes.

En el caso del partido político es bastante normal leer su declaración y entender que una vez ocurrido este problema, hagan todo lo posible para lavarse las manos, declarar que es un ataque cibernético y tratar de culpar a alguien más por este problema.

Un problema problema que me surge a raíz de este problema es que mal están los medios en nuestro país, pudieron haber preguntado al área de IT o buscando en google lo que realmente había pasado y darse cuenta de que esto una mentira bastante obvia. No era un ataque, es negligencia, que el partido político está mintiendo y de lo mal que está la situación en varios puntos de esta nota.

Sin embargo, han preferido repetir la mentira del partido político y pasar a otros temas. Lo triste es que la nota con “Movimiento Ciudadano miente sobre ataques de cibernéticos” probablemente es una nota que vende más que todo lo que tienen en la portada. Por lo cual, solo son culpables de falta de interés de ser periodista con el publico, también son culpables de no querer vender con los accionistas del periódico y este es un pecado mas grande hoy en día.