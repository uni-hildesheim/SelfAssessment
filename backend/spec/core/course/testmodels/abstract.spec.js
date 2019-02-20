const sinon = require('sinon');

const AbstractTest = require('../../../../app/core/course/testmodels/abstract');

describe('AbstractTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.constructor()', () => {
        it('should throw an error', () => {
            expect( () => {
                new AbstractTest.class();
            }).toThrow(new TypeError('Cannot construct AbstractTest instances'));
        });
    });

    describe('.schema (get)', () => {
        class SampleTest extends AbstractTest.class {
            constructor() {
                super();
            }
        }

        it('should throw an error ', () => {
            expect( () => {
                SampleTest.schema;
            }).toThrow(new Error('schema() not implemented'));
        });
    });

    describe('.loadConfig()', () => {
        class SampleTest extends AbstractTest.class {
            constructor() {
                super();
            }
        }

        it('should throw an error  ', () => {
            expect( () => {
                new SampleTest().loadConfig(null);
            }).toThrow(new Error('loadConfig(...) not implemented'));
        });
    });
});
