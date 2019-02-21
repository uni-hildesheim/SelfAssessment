const RadioButtonTest = require('../../../../app/core/course/testmodels/radio_button');
const TestData = require('./data');

describe('RadioButtonTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.RadioButtonTestInstance = new RadioButtonTest.class(TestData.configs['radio-buttons']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(this.RadioButtonTestInstance.name).toEqual('radio-buttons');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(RadioButtonTest.class.schema['$id']).toEqual('RadioButtonTest');
        });
    });

    describe('.loadConfig()', () => {
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
            const ret = this.RadioButtonTestInstance.loadConfig(config);

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
            const ret = this.RadioButtonTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
