var expect = require('expect.js');
var _ = require('../../route');

describe('route', function () {
	it('with no variable /a/b/c', function(){
		var path = '/a/b/c',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([]);
		//url
		expect(rt.url()).to.be(path);
		
		//match success
		expect(rt.match('/a/b/c')).to.eql({});
		expect(rt.match('/a/b/c/')).to.eql({});
		
		//match fail
		expect(rt.match('/a/b/')).to.be(undefined);
		expect(rt.match('/a/b/c/d')).to.be(undefined);
		
	});
	
	it('with optional variable /a/b:c?', function(){
		var path = '/a/b:c?',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([ { name: 'c', optional: true } ]);
		
		expect(rt.url()).to.be('/a/b');
		expect(rt.url({c:'cd'})).to.be('/a/bcd');
		expect(rt.url({c:'-cd'})).to.be('/a/b-cd');
		expect(rt.url({c:'_cd'})).to.be('/a/b_cd');
		expect(rt.url({c:'/cd'})).to.be('/a/b/cd');
		
		//match success
		expect(rt.match('/a/b')).to.eql({c:''});
		expect(rt.match('/a/b/')).to.eql({c:''});
		
		expect(rt.match('/a/b-cd')).to.eql({c:'-cd'});
		expect(rt.match('/a/bcd')).to.eql({c:'cd'});
		expect(rt.match('/a/b_cd')).to.eql({c:'_cd'});
		
		//match fail
		expect(rt.match('/a')).to.be(undefined);
		expect(rt.match('/a/b/c')).to.be(undefined);
	});
	
	it('with optional variable /a/b/:c?', function(){
		var path = '/a/b/:c?',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([ { name: 'c', optional: true } ]);
		
		expect(rt.url()).to.be('/a/b'); //@NOTE is not /a/b/
		
		expect(rt.url({c:'cd'})).to.be('/a/b/cd');
		expect(rt.url({c:'-cd'})).to.be('/a/b/-cd');
		expect(rt.url({c:'_cd'})).to.be('/a/b/_cd');
		expect(rt.url({c:'/cd'})).to.be('/a/b//cd');
		
		//match success
		expect(rt.match('/a/b')).to.eql({c:''}); //@NOTE this is ok ?
		expect(rt.match('/a/b/')).to.eql({c:''});
		
		expect(rt.match('/a/b/-cd')).to.eql({c:'-cd'});
		expect(rt.match('/a/b/cd')).to.eql({c:'cd'});
		expect(rt.match('/a/b/_cd')).to.eql({c:'_cd'});
		
		//match fail
		expect(rt.match('/a/b-cd')).to.be(undefined);
	});

	it('with required variable /a/b/:c', function(){
		var path = '/a/b/:c',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([ { name: 'c', optional: false } ]);
		
		expect(rt.url()).to.be('/a/b/'); //@NOTE not throw
		
		expect(rt.url({c:'cd'})).to.be('/a/b/cd');
		expect(rt.url({c:'-cd'})).to.be('/a/b/-cd');
		expect(rt.url({c:'_cd'})).to.be('/a/b/_cd');
		expect(rt.url({c:'/cd'})).to.be('/a/b//cd');
		
		//match success
		
		expect(rt.match('/a/b/-cd')).to.eql({c:'-cd'});
		expect(rt.match('/a/b/cd')).to.eql({c:'cd'});
		expect(rt.match('/a/b/_cd')).to.eql({c:'_cd'});
		
		//match fail
		expect(rt.match('/a/b')).to.be(undefined);
		expect(rt.match('/a/b/')).to.be(undefined);
		expect(rt.match('/a/b/')).to.be(undefined);
	});
	
	it('with required variable to end /a/b/:c*', function(){
		var path = '/a/b/:c*',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([ { name: 'c', optional: false } ]);
		
		expect(rt.url()).to.be('/a/b/'); //@NOTE is not /a/b
		
		expect(rt.url({c:'cd'})).to.be('/a/b/cd');
		expect(rt.url({c:'-cd'})).to.be('/a/b/-cd');
		expect(rt.url({c:'_cd'})).to.be('/a/b/_cd');
		expect(rt.url({c:'/cd'})).to.be('/a/b//cd');
		
		//match success

		expect(rt.match('/a/b/-cd')).to.eql({c:'-cd'});
		expect(rt.match('/a/b/cd')).to.eql({c:'cd'});
		expect(rt.match('/a/b/_cd')).to.eql({c:'_cd'});
		
		//match fail
		expect(rt.match('/a/b-cd')).to.be(undefined);
		expect(rt.match('/a/b')).to.be(undefined);
		expect(rt.match('/a/b/')).to.be(undefined);
	});
	
	it('with multi variable /a/:b/:c/:d?', function(){
		var path = '/a/:b/:c/:d?',
			rt = _.route(path)
			;
		expect(rt.path).to.be(path);
		expect(rt.keys).to.eql([
			{ name: 'b', optional: false } ,
			{ name: 'c', optional: false } , 
			{ name: 'd', optional: true  } , 
		]);
		
		expect(rt.url()).to.be('/a//'); //@NOTE url is unsafe without correct params
		expect(rt.url({b:'b'})).to.be('/a/b/');
		expect(rt.url({c:'c'})).to.be('/a//c');
		expect(rt.url({d:'d'})).to.be('/a///d');
		
		expect(rt.url({
			b:'b',
			c:'c',
			d:'d'
		})).to.be('/a/b/c/d');
		
		//match success

		expect(rt.match('/a/b/c')).to.eql({b:'b', c:'c', d:''});
		expect(rt.match('/a/b/c/')).to.eql({b:'b', c:'c', d:''});
		expect(rt.match('/a/b/c/d')).to.eql({b:'b', c:'c', d:'d'});
		expect(rt.match('/a/b/c/d/')).to.eql({b:'b', c:'c', d:'d'});
		
		//match fail
		expect(rt.match('/a/b')).to.be(undefined);
		expect(rt.match('/a/b/')).to.be(undefined);
		expect(rt.match('/a/b/c/d/*')).to.be(undefined);
	});
	
	it('match test /:a/:b', function(){
		expect(_.route('/:a/:b').match('/a/b')).to.not.be(undefined);
		expect(_.route('/:a/:b').match('/a/b/')).to.not.be(undefined);
		expect(_.route('/:a/:b').match('/a/b/c')).to.be(undefined);
	})
	it('match test /:a/:b/', function(){
		expect(_.route('/:a/:b/').match('/a/b')).to.be(undefined);
		expect(_.route('/:a/:b/').match('/a/b/')).to.not.be(undefined);
		expect(_.route('/:a/:b/').match('/a/b/c')).to.be(undefined);
	})
	it('match test /:a/:b?', function(){
		expect(_.route('/:a/:b?').match('/a/b')).to.not.be(undefined);
		expect(_.route('/:a/:b?').match('/a/b/')).to.not.be(undefined);
		expect(_.route('/:a/:b?').match('/a/b/c')).to.be(undefined);
	})
	it('match test /:a/:b?/', function(){
		expect(_.route('/:a/:b?/').match('/a/b')).to.be(undefined);
		expect(_.route('/:a/:b?/').match('/a/b/')).to.not.be(undefined);
		expect(_.route('/:a/:b?/').match('/a/b/c')).to.be(undefined);
	})
	it('match test /:a/:b*', function(){
		expect(_.route('/:a/:b*').match('/a')).to.be(undefined);
		expect(_.route('/:a/:b*').match('/a/')).to.be(undefined);
		expect(_.route('/:a/:b*').match('/a/b')).to.not.be(undefined);
		expect(_.route('/:a/:b*').match('/a/b/')).to.not.be(undefined);
		expect(_.route('/:a/:b*').match('/a/b/c')).to.not.be(undefined);
	})
});