const SpeedTest = require('../../../../app/core/course/testmodels/speed');
const TestData = require('./data');

describe('SpeedTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.SpeedTestInstance = new SpeedTest.class(TestData.configs['speed']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(this.SpeedTestInstance.name).toEqual('speed');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(SpeedTest.class.schema['$id']).toEqual('SpeedTest');
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
