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
        it('should give the expected result', async () => {
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
                }
            ]

            const result = ResultController.calculate(this.courses[0].configs[0]['config'],
                this.users[0].journal);

            expect(result).toEqual(expectedResult);
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
