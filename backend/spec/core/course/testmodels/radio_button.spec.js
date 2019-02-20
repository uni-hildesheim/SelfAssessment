const sinon = require('sinon');

const RadioButtonTest = require('../../../../app/core/course/testmodels/radio_button');

describe('RadioButtonTest', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.constructor()', () => {
        const instance = new RadioButtonTest.class();

        it('should set the name', () => {
            expect(instance.name).toEqual('radio-buttons');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(RadioButtonTest.class.schema['$id']).toEqual('RadioButtonTest');
        });
    });

    describe('.loadConfig()', () => {
        const instance = new RadioButtonTest.class();

        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "radio-buttons",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": true
                    }
                ],
            };
            const ret = instance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "radio-buttons",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": true
                    }
                ],
                "evaluated": true,
            };
            const ret = instance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
