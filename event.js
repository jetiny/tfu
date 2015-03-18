module.exports.Event = TinyEvent;

function TinyEvent() {
    this._events = {};
}

TinyEvent.prototype = {
    on: function(event, callback){
        callback && (this._events[event] || (this._events[event] = [])).push(callback);
        return this;
    },
    off: function(event, callback){
    	if (!(event || callback)) {
    		this._events = {};
    	} else {
    		var list = this._events[event];
    		if (list) {
    			if (callback) {
    				for (var i = list.length - 1; i >= 0; i--) {
    					if (list[i] === callback) {
    						list.splice(i, 1);
    					};
    				}
    			} else {
    				delete this._events[event];
    			}
    		}
    	}
        return this;
    },
    once: function(event, callback){
        var that = this, 
            func = function(){
                that.off(event, func);
                callback && callback.apply(null, arguments);
            };
        that.on(event, func);
        return this;
    },
    emit: function(event){
        var list;
    	if ( list = this._events[event]) {
    		list = list.slice();
    		var fn, args = list.slice.call(arguments, 1);
    		while ((fn = list.shift())) {
    			fn.apply(null, args);
    		}
    	}
        return this;
    }
};
