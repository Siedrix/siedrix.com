var moment = require('moment')
var s = require("underscore.string")

var utils = {}

utils.prettyDate = function(date, item){
	var m = moment(date)

	var str = m.locale('es').format('MMMM DD YYYY')
	str = s(str).capitalize().value()

	return str
}

module.exports = utils