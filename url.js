var _ = require('./type'),
    _each = require('./each'),
    ;

//jsuri https://code.google.com/r/jonhwendell-jsuri/

// https://username:password@www.test.com:8080/path/index.html?this=that&some=thing#content
var REKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]
    ,URL_RE = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    ,_encode = encodeURIComponent
    ;

function buildQuery( prefix, obj, add, _name) {
    if ( _.isArray( obj ) ) {// Serialize array item.
        _each( obj, function(i, v) {
            if (/\[\]$/.test( prefix ) ) {// scalar item
                add( prefix, v );
            } else { // Item is non-scalar (array or object), encode its numeric index.
                buildQuery( prefix + "[" + ( _.isObject(v) ? i : "" ) + "]", v, add );
            }
        });
    } else if ( _.isObject( obj )) {
        for ( _name in obj ) {
            buildQuery( prefix + "[" + _name + "]", obj[ _name ], add );
        }
    } else {// scalar item
        add( prefix, obj );
    }
}

function addQuery(query, name, value) {
    name = name.replace(/\+/g, ' ');
    if (value == null) {// same as undefined
        delete query[name];
    } else {
        if (_.isString(value))
            value = value.replace(/\+/g, ' ')
        query[name] = value;
    }
}

function parseUrl(str) {
    var _uri = {} ,
        _m = URL_RE.exec(str || ''),
        _i = REKeys.length
    ;
    while (_i--) {
        _uri[REKeys[_i]] = _m[_i] || "";
    }
    return _uri;
}

function _isset(s){
    return (s != null && s != '');
}

function toUrl(uri) {
    uri || (uri = {})
    var _str = '', _tmp;
    if (_isset(_tmp = uri.protocol)) {
        _str += _tmp;
        if (_tmp.indexOf(':') != _tmp.length - 1) {
            _str += ':';
        }
        _str += '//';
    } else if ((uri.source || '').indexOf('//') != -1 && _isset(uri.host)){
        _str += '//';
    }
    if (_isset(_tmp = uri.userInfo) && _isset(uri.host)) {
        _str += _tmp;
        if (_tmp.indexOf('@') != _tmp.length - 1){
            _str += '@';
        }
    }
    if (_isset(uri.host)) {
        _str += uri.host;
        if (_isset(uri.port))
            _str += ':' + uri.port;
    }
    if (_isset(uri.path)) {
        _str += uri.path;
    } else if (_isset(uri.host) && (_isset(uri.query) || _isset(uri.anchor))){
        _str += '/';
    }
    if (_isset(uri.query)) {
        if (_.isObject(uri.query)){
            if (_tmp = toQuery(uri.query)){
                _str += '?' + _tmp;
            }
        } else {
            if (uri.query.indexOf('?') != 0)
                _str += '?';
        }
        _str += uri.query;
    }
    if (_isset(uri.anchor)) {
        if (uri.anchor.indexOf('#') != 0)
            _str += '#';
        _str += uri.anchor;
    }
    return _str;
}

//parseQuery # http://stackoverflow.com/questions/1131630/the-param-inverse-function-in-javascript-jquery
function parseQuery(str) { // a[b]=1&a[c]=2&d[]=3&d[]=4&d[2][e]=5 <=> { a: { b: 1, c: 2 }, d: [ 3, 4, { e: 5 } ] }
    var _querys = {};
    decodeURIComponent(str || '')
        //.replace(/\+/g, ' ')
        // (optional no-capturing & )(key)=(value)
        .replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, _name, _value) {
            console.log(arguments)
            if (_name) {
                var _path, _acc, _nextAcc, _ref;
                (_path = []).unshift(_name = _name.replace(/\[([^\]]*)\]/g, function($0, _k) {
                    _path.push(_k);
                    return "";
                }));
                _ref = _querys;
                for (var j=0; j<_path.length-1; j++) {
                    _acc = _path[j];
                    _nextAcc = _path[j+1];
                    if (!_ref[_acc]) {
                        _ref[_acc] = ((_nextAcc == "") || (/^[0-9]+$/.test(_nextAcc))) ? [] : {};
                    }
                    _ref = _ref[_acc];
                }
                ("" == (_acc = _path[_path.length-1])) ? _ref.push(_value) : _ref[_acc] = _value;
            }
        });
    return _querys;
}

//toQuery # http://api.jquery.com/jQuery.param
function toQuery(query) {
    var _str = [],
        _add = function( key, value ) {
            _str.push(_encode( key ) + "=" + _encode( value || "" ));
        }
    _each(query || {},function(id, it){
        buildQuery(id, it, _add)
    });
    return _str.join( "&" ).replace(/%20/g, '+');
}

function replaceQuery(url, name, value) {
    var _uri = parseUrl(url),
        _query = parseQuery(_uri);
    if (_.isString(name)) {
        addQuery(_query, name, value)
    } else if(_.isObject(name)) {
        _each(name, function(_name, value){
            addQuery(_query, _name, value)
        })
    }
    _uri.query = toQuery(_query);
    return toUrl(_uri);
}

function isCrossUrl(url, compare) {
    if (/^([\w-]+:)?\/\/([^\/]+)/.test(url)){
        return RegExp.$2 != (compare || location.host)
    }
}

module.exports = {
    "isCrossUrl":isCrossUrl,
    "replaceQuery":replaceQuery,
    "toQuery":toQuery,
    "parseQuery":parseQuery,
    "toUrl":toUrl,
    "parseUrl":parseUrl
};
