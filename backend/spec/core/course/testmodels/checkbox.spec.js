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

        it('should throw an error for invalid configs', () => {
            expect( () => {
                new CheckboxTest.class({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(CheckboxTest.class.schema['$id']).toEqual('CheckboxTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return 0 for no correct options', () => {
            const config = JSON.parse(JSON.stringify(TestData.configs['checkbox']));
            for (const opt of config.options) {
                delete opt.correct;
            }
            const instance = new CheckboxTest.class(config);

            expect(instance.maxScore).toEqual(0);
        });

        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['checkbox'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.CheckboxTestInstance.maxScore).toEqual(expectedMaxScore);
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
