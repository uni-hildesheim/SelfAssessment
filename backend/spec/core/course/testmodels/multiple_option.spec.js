const sinon = require('sinon');

const MultipleOptionTest = require('../../../../app/core/course/testmodels/multiple_option');

describe('MultipleOptionTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.constructor()', () => {
        const instance = new MultipleOptionTest.class();

        it('should set the name', () => {
            expect(instance.name).toEqual('multiple-options');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(MultipleOptionTest.class.schema['$id']).toEqual('MultipleOptionTest');
        });
    });

    describe('.loadConfig()', () => {
        const instance = new MultipleOptionTest.class();

        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "multiple-options",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": 0
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
                "category": "multiple-options",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": 0
                    }
                ],
                "evaluated": true,
                "header": [
                    "Yes",
                    "No"
                ]
            };
            const ret = instance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
