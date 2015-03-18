var expect = require('expect.js');
var _ = require('../../event');

describe('event', function () {
    
    it('event.on', function(){
        var evt = new _.Event;
        
        evt.on('test', function(arg1, arg2){
            expect(arg1).to.be(1);
            arg2.val++;
        });
        evt.on('test', null);
        evt.on('test', function(arg1, arg2){
            expect(arg2.val).to.be(2);
        });
        evt.emit('test', 1, {val:1});
    });
    
    it('event.off', function(){
        var evt = new _.Event, args = {
            val:1,
        }, func = function(arg){
            arg.val++;
        };
        evt.on('test', func);
        evt.emit('test', args);
        expect(args.val).to.be(2);
        
        evt.off('test', func);
        evt.emit('test', args);
        expect(args.val).to.be(2);
        expect(evt._events).to.eql({test:[]});
        
        evt.on('test', function(){});
        evt.on('test', function(){});
        expect(evt._events.test.length).to.be(2);
        evt.off('test');
        expect(evt._events.test).to.be(undefined);
    });
    
    it('event.once', function(){
        var evt = new _.Event, args = {
            val:1,
        };
        evt.once('test', function(arg){
            arg.val++;
        });
        evt.emit('test', args);
        expect(args.val).to.be(2);
        
        evt.emit('test', args);
        expect(args.val).to.be(2);
        expect(evt._events).to.eql({test:[]});
    });
    
});