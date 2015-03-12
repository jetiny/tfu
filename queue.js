module.exports = function (context, _done){
    context = context || null;
	var Q = function (err){
			if (!err){
				var it = _q.shift();
				if (it) {
					var args = arguments;
					args.length ? (args[0] = Q) : (args = [Q]);
					return it.apply(context, args);
				}
			}
			return _done.apply(context, arguments);
		},
		_q = Q._queue = [];
    Q.push = Q.next = function(){
        _q.push.apply(_q, arguments);
        return Q;
    }
    Q.unshift = function(){
        _q.unshift.apply(_q, arguments);
        return Q;
    }
    Q.prepare = function(){
        var args = arguments;
        _q.unshift.call(args, null);
        _q.push(function(next){
            next.apply(next, args);
        });
        return Q;
    }
    Q.append = function(that){
        _q.push.apply(_q, that._queue);
        return Q;
    }
    Q.prepend = function(that){
        _q.unshift.apply(_q, that._queue);
        return Q;
    }
    Q.done = function(func){
        _done = func;
        Q.start();
    }
    Q.start = function(){
        Q(null, Q);
    }
    return Q;
}