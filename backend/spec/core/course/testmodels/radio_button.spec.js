const RadioButtonTest = require('../../../../app/core/course/testmodels/radio_button');
const TestData = require('./data');

describe('RadioButtonTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.RadioButtonTestInstance = new RadioButtonTest(TestData.configs['radio-buttons']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(RadioButtonTest.name).toEqual('radio-buttons');
        });

        it('should throw an error for invalid configs', () => {
            expect( () => {
                new RadioButtonTest({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.name (get)', () => {
        it('should return the test name', () => {
            expect(RadioButtonTest.name).toEqual('radio-buttons');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(RadioButtonTest.schema['$id']).toEqual('RadioButtonTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return 0 for no correct options', () => {
            const config = JSON.parse(JSON.stringify(TestData.configs['radio-buttons']));
            for (const opt of config.options) {
                delete opt.correct;
            }
            const instance = new RadioButtonTest(config);

            expect(instance.maxScore).toEqual(0);
        });

        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['radio-buttons'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.RadioButtonTestInstance.maxScore).toEqual(expectedMaxScore);
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

    describe('.calculateResult(log)', () => {
        it('should calculate correct result', () => {
            const log = [
                true
            ];
            const result = this.RadioButtonTestInstance.calculateResult(log);

            expect(result.score).toEqual(1);
            expect(result.correct.length).toEqual(1);
            expect(result.wrong.length).toEqual(0);
        });
    });
});
