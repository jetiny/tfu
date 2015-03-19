var expect = require('expect.js');
var _tr = require('../../tr').tr;

describe('tr', function () {
    
  	it('tr default', function(){
        var tr = _tr.create();
        
        tr.extend('en', {a:'locate_a_en'});
        tr.extend('de', {a:'locate_a_de'});
        
        expect(tr('a')).to.be('locate_a_en');
        
        tr.locate = 'de';
        expect(tr('a')).to.be('locate_a_de');
        
        tr.defaultLocate = 'de';
        tr.locate = 'en';
        
        expect(tr('a')).to.be('locate_a_en');
        
        tr.extend('de', {b:'locate_b_de'});
        expect(tr('b')).to.be('locate_b_de');
        
        expect(tr('x.y', 'z')).to.be('[x.y.z]');
	});
    
  	it('tr extend', function(){
        var tr = _tr.create();
        
		tr.extend(tr.locate, {a:'locate_a'});
            expect(tr('a')).to.be('locate_a');
        tr.extend(tr.locate, {a:{a:'locate_a'}});
            expect(tr('a.a')).to.be('locate_a');
        tr.extend(tr.locate, {a:'locate_a'});
            expect(tr('a')).to.be('locate_a');
            
        tr.extend(tr.locate, {a:['locate_0','locate_1']});
            expect(tr('a.0')).to.be('locate_0');
            expect(tr('a', 1)).to.be('locate_1');
        
        tr.extend(tr.locate, {x:{y:{z:"xyz"}}});
        expect(tr('x.y.z')).to.be('xyz');
	});
    
  	it('tr module', function(){
        var tr = _tr.create();
        tr.extend(tr.locate, {x:{y:{z:"xyz"}}});
        expect(tr.module("x.y")('z')).to.be('xyz');
        expect(tr.module("x")('y.z')).to.be('xyz');
	});
    
});
