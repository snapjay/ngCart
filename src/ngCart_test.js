'use strict';

describe('ngCart.version module', function() {
    beforeEach(module('ngCart'));

    describe('version service', function() {
        it('should return current version', inject(function(version) {
            expect(version).toEqual('0.0.3-rc.1');
        }));
    });
});