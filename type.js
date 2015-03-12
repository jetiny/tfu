var toString = Object.prototype.toString,
	_ = require('./each');

function isType(type) {
    return function(t) {
        return toString.call(t) === "[object " + type + "]";
    }
}

module.exports = {
	isType: isType,
	isArray: Array.isArray || isType("Array"),
	isObject: function (val) {
		return val !== null && typeof val === 'object';
	},
	isUndefined: function ( val ) {
		return typeof val === 'undefined' ;
	},
	isPlainObject: function ( obj ) {
		return obj && obj.constructor === Object.prototype.constructor;
	}
}

_.splitEach("Boolean Number String Function RegExp Date File Blod", function(id, it){
    module.exports["is"+it] = isType(it);
});