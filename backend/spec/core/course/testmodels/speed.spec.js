const SpeedTest = require('../../../../app/core/course/testmodels/speed');
const TestData = require('./data');

describe('SpeedTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.SpeedTestInstance = new SpeedTest(TestData.configs['speed']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(SpeedTest.name).toEqual('speed');
        });

        it('should throw an error for invalid configs', () => {
            expect( () => {
                new SpeedTest({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.name (get)', () => {
        it('should return the test name', () => {
            expect(SpeedTest.name).toEqual('speed');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(SpeedTest.schema['$id']).toEqual('SpeedTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['speed'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.SpeedTestInstance.maxScore).toEqual(expectedMaxScore);
        });
    });

    describe('.loadConfig()', () => {
        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "speed",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": "Ye"
                    }
                ],
                "evaluated": true
            };
            const ret = this.SpeedTestInstance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "speed",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": "Ye"
                    }
                ],
                "evaluated": true,
                "seconds": 1
            };
            const ret = this.SpeedTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
