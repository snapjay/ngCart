describe('version', function() {
    beforeEach(module('ngCart'));

    it('should return current cow', inject(function(version) {
        expect('cow').toEqual('cow');
    }));

    it('should return current key', inject(function(key) {
        expect(key).toEqual('test');
    }));

});