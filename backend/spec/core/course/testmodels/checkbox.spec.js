const CheckboxTest = require('../../../../app/core/course/testmodels/checkbox');
const TestData = require('./data');

describe('CheckboxTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.CheckboxTestInstance = new CheckboxTest.class(TestData.configs['checkbox']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(this.CheckboxTestInstance.name).toEqual('checkbox');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(CheckboxTest.class.schema['$id']).toEqual('CheckboxTest');
        });
    });

    describe('.loadConfig()', () => {
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
            const ret = this.CheckboxTestInstance.loadConfig(config);

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
            const ret = this.CheckboxTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
