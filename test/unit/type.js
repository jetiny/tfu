var expect = require('expect.js');
var _ = require('../../type');

describe('type', function () {

    var items = {
        'Object': {},
        'Array': [],
        'Undefined':undefined,
        'Boolean':true,
        'Number':1.,
        'String':'',
        'Function':function(){},
        'RegExp':/text/,
        'Date': new Date(),
    };
    var olists = ['RegExp', 'Date'];
    var sepcs = {
        'null':null,
        'NaN':NaN
    };
    
    Object.keys(items).forEach(function(name){
        //items
        Object.keys(items).forEach(function(key){
            it('type.is'+name+'('+ key + ')', function(){
                expect(_['is'+ name](items[key])).to.be(
                    (name == 'Object' && olists.indexOf(key) !== -1) ? true : 
                    name === key
                );
            });
        });
        //specs
        Object.keys(sepcs).forEach(function(key){
            it('type.is'+name+'('+ key + ')', function(){
                expect(_['is'+ name](sepcs[key])).to.be(
                    (name == 'Number' && key == 'NaN') ? true : false
                );
            });
            //isPlainObject
            it('type.isPlainObject('+ key + ')', function(){
                expect(_.isPlainObject(sepcs[key])).to.be(false);
            });
        });
        //isPlainObject
        it('type.isPlainObject('+ name + ')', function(){
            expect(_.isPlainObject(items[name])).to.be(!!(name === 'Object'));
        });
    });
});