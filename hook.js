module.exports.hook = (function factory(){
	var _handles = [];
	function hook(name, callback) {
		var _prev = _handles[name];
		_handles[name] = callback;
		return _prev || _.noop;
	}
	hook.create = factory;
	hook.apply = function (name) {
		return _handles[name] && _handles[name].apply(null, [].slice.call(arguments, 1));
	};
	return hook;
})();
