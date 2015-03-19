var _ = require('./extend') //require type

_.extend(module.exports ,
    require('./base'),            //single
    require('./type'),            //single
    require('./each'),            //single
    require('./queue'),           //single
    require('./inherits'),        //single
    require('./route'),           //single
    require('./event'),           //single
    require('./hook')             //single
    require('./tmpl')             //single
    require('./tr')               //require extend
);
