const MultipleChoiceTest = require('../../../../app/core/course/testmodels/multiple_choice');
const TestData = require('./data');

describe('MultipleChoiceTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.MultipleChoiceTestInstance = new MultipleChoiceTest(TestData.configs['multiple-choice']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should throw an error for invalid configs', () => {
            expect( () => {
                new MultipleChoiceTest({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.name (get)', () => {
        it('should return the test name', () => {
            expect(MultipleChoiceTest.name).toEqual('multiple-choice');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(MultipleChoiceTest.schema['$id']).toEqual('MultipleChoiceTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return 0 for no correct options', () => {
            const config = JSON.parse(JSON.stringify(TestData.configs['multiple-choice']));
            for (const opt of config.options) {
                delete opt.correct;
            }
            const instance = new MultipleChoiceTest(config);

            expect(instance.maxScore).toEqual(0);
        });

        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['multiple-choice'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.MultipleChoiceTestInstance.maxScore).toEqual(expectedMaxScore);
        });
    });

    describe('.loadConfig()', () => {
        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "multiple-choice",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": true
                    }
                ]
            };
            const ret = this.MultipleChoiceTestInstance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "multiple-choice",
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
            const ret = this.MultipleChoiceTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });

    describe('.calculateResult(log)', () => {
        it('should calculate correct result', () => {
            const log = [
                true,
                false
            ];
            const result = this.MultipleChoiceTestInstance.calculateResult(log);

            expect(result.score).toEqual(1);
            expect(result.correct.length).toEqual(1);
            expect(result.wrong.length).toEqual(0);
        });
    });
});
