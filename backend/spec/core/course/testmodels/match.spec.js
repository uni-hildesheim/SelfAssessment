const MatchTest = require('../../../../app/core/course/testmodels/match');
const TestData = require('./data');

describe('MatchTest', () => {
    beforeEach( () => {
        // create a new object each time to ensure tests do not affect each other
        this.MatchTestInstance = new MatchTest(TestData.configs['match']);
    });

    afterEach( () => {
        // dummy
    });


    describe('.constructor()', () => {
        it('should set the name', () => {
            expect(MatchTest.name).toEqual('match');
        });

        it('should throw an error for invalid configs', () => {
            expect( () => {
                new MatchTest({})
            }).toThrow(new Error('Invalid test config'));
        });
    });

    describe('.name (get)', () => {
        it('should return the test name', () => {
            expect(MatchTest.name).toEqual('match');
        });
    });

    describe('.schema (get)', () => {
        it('should set the schema id', () => {
            expect(MatchTest.schema['$id']).toEqual('MatchTest');
        });
    });

    describe('.maxScore (get)', () => {
        it('should return n for n correct options', () => {
            let expectedMaxScore = 0;
            for (const opt of TestData.configs['match'].options) {
                if ('correct' in opt) {
                    expectedMaxScore++;
                }
            }

            expect(this.MatchTestInstance.maxScore).toEqual(expectedMaxScore);
        });
    });

    describe('.loadConfig()', () => {
        it('should return false for invalid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "match",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": "Ye",
                        //"index": "0"
                    }
                ],
                "evaluated": true
            };
            const ret = this.MatchTestInstance.loadConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs', () => {
            const config = {
                "id": 1001,
                "type": "logic",
                "category": "match",
                "description": "",
                "task": "",
                "options": [
                    {
                        "text": "Yes",
                        "correct": "Ye",
                        "index": "0"
                    }
                ],
                "evaluated": true,
                "seconds": 1
            };
            const ret = this.MatchTestInstance.loadConfig(config);

            expect(ret).toBe(true);
        });
    });
});
