//jsuri https://code.google.com/r/jonhwendell-jsuri/

// https://username:password@www.test.com:8080/path/index.html?this=that&some=thing#content
var REKeys = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"]
    ,URL_RE = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    ;

module.exports.Url = {
    parse: function parseUrl(str) {
        var _uri = {},
            _m = URL_RE.exec(str || ''),
            _i = REKeys.length;
        while (_i--) {
            _uri[REKeys[_i]] = _m[_i] || "";
        }
        return _uri;
    },
    stringify: function toUrl(uri) {
        var str = '';
        if (uri) {
            if (uri.host) {
                uri.protocol && (str += uri.protocol + ':');
                str += '//';
                uri.user     && (str += uri.user + ':');
                uri.password && (str += uri.password + '@');
                str += uri.host;
                uri.port && (str += ':'+ uri.port);
            }
            str += uri.path || '';
            uri.query  && (str += '?'+uri.query);
            uri.anchor && (str += '#'+uri.anchor);
        }
        return str;
    }
};
