var expect = require('expect.js');
var tmpl = require('../../tmpl').tmpl;

describe('tmpl', function () {
  	it('tmpl basic', function(){
		expect(tmpl('{%=a%}')({a:'Hello World'})).to.eql("Hello World");
	});
    it('tmpl escaped', function(){
        expect(tmpl('{%=a%}')({a:'<a>&b"\''})).to.eql("&lt;a&gt;&amp;b&quot;&#39;");
	});
});
