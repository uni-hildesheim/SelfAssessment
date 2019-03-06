const BaseTest = require('../../../../app/core/course/testmodels/base');

describe('BaseTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // dummy
    });

    describe('.constructor()', () => {
        it('should throw an error', () => {
            expect( () => {
                new BaseTest({});
            }).toThrow(new TypeError('Cannot construct BaseTest instances'));
        });
    });

    describe('.schema (get)', () => {
        it('should not throw ', () => {
            expect( () => {
                BaseTest.schema;
            }).not.toThrow();
        });
    });

    describe('.maxScore (get)', () => {
        class SampleTest extends BaseTest {
            constructor(config) {
                super(config);
            }
        }

        it('should throw an error  ', () => {
            expect( () => {
                new SampleTest({}).maxScore;
            }).toThrow(new Error('maxScore() not implemented'));
        });
    });

    describe('.loadConfig()', () => {
        class SampleTest extends BaseTest {
            constructor(config) {
                super(config);
            }
        }

        it('should throw an error   ', () => {
            expect( () => {
                new SampleTest({}).loadConfig(null);
            }).toThrow(new Error('loadConfig(...) not implemented'));
        });
    });

    describe('.calculateResult (get)', () => {
        class SampleTest extends BaseTest {
            constructor(config) {
                super(config);
            }
        }

        it('should throw an error    ', () => {
            expect( () => {
                new SampleTest({}).calculateResult({});
            }).toThrow(new Error('calculateScore(...) not implemented'));
        });
    });
});
