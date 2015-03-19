// i18n (en + ?) 
var _extend = require('./extend').extend;

function translate(locate, defaultLocate, paths, equal) {
    var it,
        items = paths.slice();
    while(it = items.shift()) {
        if (locate){
            locate = locate[it];
        }
        else break;
    }
    if (locate)
        return [true, locate];
    if (equal)
        return [false];
    while(it = paths.shift()) {
        if (defaultLocate){
            defaultLocate = defaultLocate[it];
        }
        else break;
    }
    return [false, defaultLocate];
}

module.exports.tr = (function factory(){
    var _locates = {};
    
    function tr(ns, key) {
        var path = key ? (ns+'.'+key) : ns,
            r = translate(_locates[tr.locate], _locates[tr.defaultLocate], path.split('.'), tr.defaultLocate == tr.locate);
        if (r[0])
            return r[1];
        if (tr.warn) { // user warn interface
            tr.warn(path, r[1]);
        }
        return r[1] || ('['+path+']');
    }
    
    tr.locate = tr.defaultLocate = 'en';
    
    tr.extend = function(abbr, datas){
        _extend(true, _locates[abbr] || (_locates[abbr] = {}), datas);
    }
    
    tr.create = factory;
    
    tr.module = function(ns) {
        return function(key) {
            return tr(ns, key);
        }
    }
    
    return tr;
})();;

