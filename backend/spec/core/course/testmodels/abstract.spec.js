const AbstractTest = require('../../../../app/core/course/testmodels/abstract');

describe('AbstractTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // dummy
    });

    describe('.constructor()', () => {
        it('should throw an error', () => {
            expect( () => {
                new AbstractTest({});
            }).toThrow(new TypeError('Cannot construct AbstractTest instances'));
        });
    });

    describe('.schema (get)', () => {
        it('should not throw ', () => {
            expect( () => {
                AbstractTest.schema;
            }).not.toThrow();
        });
    });

    describe('.maxScore (get)', () => {
        class SampleTest extends AbstractTest {
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
        class SampleTest extends AbstractTest {
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
        class SampleTest extends AbstractTest {
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
