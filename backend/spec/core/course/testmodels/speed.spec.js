const sinon = require('sinon');

const SpeedTest = require('../../../../app/core/course/testmodels/speed');

describe('SpeedTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.constructor()', () => {
        const instance = new SpeedTest.class();

        it('should set the name', () => {
            expect(instance.name).toEqual('speed');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(SpeedTest.class.schema['$id']).toEqual('SpeedTest');
        });
    });

    describe('.loadConfig()', () => {
        const instance = new SpeedTest.class();

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
            const ret = instance.loadConfig(config);

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
            const ret = instance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
