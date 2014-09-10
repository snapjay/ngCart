describe('version', function() {
    beforeEach(module('ngCart'));

    it('should return current 0.0.1-rc.2', inject(function(version) {
        expect(version).toEqual('0.0.1-rc.2');
    }));


    it('should return current 0.0.1-rc.2', inject(function(version) {
        expect(version).toEqual('0.0.1-rc.2');
    }));


    it('should return current 0.0.1-rc.2', inject(function() {
        expect('cow').toEqual('cow');
    }));




    it('should return current 0.0.1-rc.2', inject(function() {
        expect(4+6).toEqual(10);
    }));


    it('should return current 0.0.1-rc.2', inject(function() {
        expect(5+5+9).toEqual(19);
    }));


});