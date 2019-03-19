const sinon = require('sinon');

const CourseModel = require('../../../app/core/course/course.model');
const CourseData = require('./../course/course.data');
const UserModel = require('../../../app/core/user/user.model');
const ResultController = require('../../../app/core/user/result.controller');
const TestDocuments = require('./user.data');
const error = require('../../../app/shared/error');

describe('ResultController', () => {
    beforeEach( () => {
        // test data
        this.courses = CourseData;
        this.users = TestDocuments;

        // common response object with spies
        this.res = {
            json: sinon.spy(),
            status: sinon.stub().returns({
                json: sinon.spy(),
                send: sinon.spy()
            })
        };
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

    describe('.calculate(config, journal)', () => {
        it('should return null for missing test config', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.courses[0].configs[0]['config']));

            config['tests'][0]['id'] = 0;

            const result = ResultController.calculate(config, this.users[0].journal);

            expect(result).toBe(null);
        });

        it('should return null for missing test log', () => {
            // ugly hack to perform a deep copy of the actual journal
            const journal = JSON.parse(JSON.stringify(this.users[0].journal));

            journal['log']['sets'][0]['maps'][1]['key'] = 0;

            const result = ResultController.calculate(this.courses[0].configs[0]['config'],
                journal);

            expect(result).toBe(null);
        });

        it('should give the expected result', () => {
            const expectedResult = [
                {
                    "id": "1002",
                    "score": 1,
                    "maxScore": 2,
                    "correctOptions": [0],
                    "wrongOptions": [1]
                },
                {
                    "id": "1003",
                    "score": 0,
                    "maxScore": 1,
                    "correctOptions": [],
                    "wrongOptions": []
                },
                {
                    "id": "1005",
                    "score": 1,
                    "maxScore": 3,
                    "correctOptions": [1],
                    "wrongOptions": [0, 2]
                },
                {
                    "id": "1006",
                    "score": 1,
                    "maxScore": 2,
                    "correctOptions": [0],
                    "wrongOptions": []
                }
            ]

            const result = ResultController.calculate(this.courses[0].configs[0]['config'],
                this.users[0].journal);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('.generateValidationCode(schema)', () => {
        it('should return AIAFHadegh73 for schema: "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])"', () => {
            const schema = 'AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])';
            const code = ResultController.generateValidationCode(schema);

            expect(code).toMatch(schema);
        });

        it('should return AIAFHadegh73[x] for schema: "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9"', () => {
            const schema = 'AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9';
            const code = ResultController.generateValidationCode(schema);
            let unicodeNumber = 0;

            // extract the number in the capture group
            for (let i = 2; i < code.length-1; i++) {
                unicodeNumber += code.charCodeAt(i);
            }

            // first, match the regex part (everything but the %n part) of the schema
            expect(code.substr(0, code.length-1)).toMatch(schema.substr(0, schema.length-2));
            // now check the checksum part (%n)
            expect(Number.parseInt(code.charAt(code.length-1))).toEqual(unicodeNumber % Number.parseInt(schema.charAt(schema.length-1)));
        });
    });

    describe('.load(req, res)', () => {
        it('should return HTTP 404 for invalid pin', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: 0
                }
            };

            await ResultController.load(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.notCalled(CourseModel.findOne);
            sinon.assert.notCalled(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should load result from the DB', async () => {
            sinon.stub(UserModel, 'findOne').resolves(this.users[0]);

            const req = {
                body: {
                    pin: this.users[0].pin
                }
            };

            await ResultController.load(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, sinon.match.array.deepEquals([]));
        });
    });

    describe('.lock(req, res)', () => {
        it('should return HTTP 404 for invalid pin ', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: 0
                }
            };

            await ResultController.lock(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.notCalled(CourseModel.findOne);
            sinon.assert.notCalled(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should generate a validation code', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(this.courses[0]);
            sinon.stub(UserModel, 'findOne').resolves(this.users[0]);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            // TODO: Ideally, each test should get its own test data, or all tests should be
            // executed in a specific, synchronous order (which Jasmine does not do).
            // Because of that, the next test cannot use ResultInstance because there might
            // be a race and the validationCode attribute ends up being modified in the wrong
            // order.

            const req = {
                body: {
                    pin: this.users[0].pin
                }
            };

            await ResultController.lock(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
        });

        it('should not overwrite existing validation codes', async () => {
            const userInstance = new UserModel({
                pin: 12345678,
                journal: {
                    structure: {
                        language: 'English'
                    }
                },
                result: {
                    validationCode: 'DUMMY'
                }
            });
            sinon.stub(CourseModel, 'findOne').resolves(this.courses[0]);
            sinon.stub(UserModel, 'findOne').resolves(userInstance);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: 12345678
                }
            };


            await ResultController.lock(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.notCalled(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);

            expect(userInstance.result.validationCode).toBe('DUMMY');
        });
    });

    describe('.update(req, res)', () => {
        it('should return HTTP 404 for invalid pin  ', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'findOne').resolves(null);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: 0
                }
            };

            await ResultController.load(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.notCalled(CourseModel.findOne);
            sinon.assert.notCalled(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should calculate result and save to the DB ', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(this.courses[0]);
            sinon.stub(UserModel, 'findOne').resolves(this.users[0]);
            sinon.stub(UserModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: this.users[0].pin
                }
            };

            await ResultController.update(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
        });
    });
});
