var _encode = encodeURIComponent,
    _ = require('./type'),
    _each = require('./each').each;

var r20 = /%20/g,
	rbracket = /\[\]$/
    ;

function buildParams( prefix, obj, add ) {
	var name;
	if ( _.isArray( obj ) ) {
		// Serialize array item.
		_each( obj, function( i, v ) {
			if ( rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, add );
			}
		});
	} else if (_.isObject( obj )) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], add );
		}
	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

module.exports.Query = {
    //# http://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery
    parse: function parseQuery(str, opts) { // a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5 <=> { a: { b: 1, c: 2 }, d: [ 3, 4, { e: 5 } ] }
        var _querys = {};
        opts || (opts = {}); // intval, boolval
        decodeURIComponent(str || '')
            .replace(/\+/g, ' ')
            // (optional no-capturing & )(key)=(value)
            .replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, _name, _value) {
                
                if (_name) {
                    var _path, _acc, _tmp, _ref;
                    (_path = []).unshift(_name = _name.replace(/\[([^\]]*)\]/g, function($0, _k) {
                        _path.push(_k);
                        return "";
                    }));
                    _ref = _querys;
                    for (var j=0; j<_path.length-1; j++) {
                        _acc = _path[j];
                        _tmp = _path[j+1];
                        if (!_ref[_acc]) {
                            _ref[_acc] = ((_tmp == "") || (/^[0-9]+$/.test(_tmp))) ? [] : {};
                        }
                        _ref = _ref[_acc];
                    }
                    
                    if(opts.boolval){//first
                        if ("true" === _value)
                            _value = true
                        else if ("false" === _value)
                            _value = false
                    } else if (opts.intval){// skip "true" & "false"
                        if ((_tmp = parseInt(_value) == _value))
                            _value = _tmp
                    }
                    
                    ("" == (_acc = _path[_path.length-1])) ? _ref.push(_value) : _ref[_acc] = _value;
                }
            });
        return _querys;
    },
    //# http://api.jquery.com/jQuery.param
    stringify: function toQuery(query) {
        var _add = function( key, value ) {
                _str.push(_encode( key ) + "=" +  (value == null ? "" : _encode( value )));
                //_str.push(( key ) + "=" +  (value == null ? "" : ( value )));
            },
            _str = [];
        _each(query || {},function(id, it){
            buildParams(id, it, _add)
        });
        return _str.join( "&" ).replace(r20,'+');
    }
}
