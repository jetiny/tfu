module.exports = {
	noop: function (){
	},
	slice: function(args, startIndex){
		return Array.prototype.slice.call(args, startIndex || 0);
	},
	inArray: function(ary, it) {
		return ary && ary.indexOf(it) >=0;
	},
	proxy: function( fn, context ){
		return function(){
			fn.apply(context, arguments);
		}
    },
	keys: Object.keys,
	randId: function () {
		return Math.round((new Date().getTime())+Math.random()*1000001);
	}
}