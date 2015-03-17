var _ = require('./extend') //type

_.extend(module.exports ,
	require('./base'),			//single
	require('./type'),			//single
	require('./each'),			//single
	require('./queue'),			//single
	require('./inherits'),		//single
	require('./route'),			//single
	require('./hook')			//require type
);
