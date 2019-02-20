const sinon = require('sinon');

const CheckboxTest = require('../../../../app/core/course/testmodels/checkbox');

describe('CheckboxTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.constructor()', () => {
        const instance = new CheckboxTest.class();

        it('should set the name', () => {
            expect(instance.name).toEqual('checkbox');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(CheckboxTest.class.schema['$id']).toEqual('CheckboxTest');
        });
    });

    describe('.loadConfig()', () => {
        const instance = new CheckboxTest.class();

        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "checkbox",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": true
                    }
                ]
            };
            const ret = instance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "checkbox",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": true
                    }
                ],
                "evaluated": true
            };
            const ret = instance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
