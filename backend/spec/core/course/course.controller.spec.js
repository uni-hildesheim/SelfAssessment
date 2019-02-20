const sinon = require('sinon');

const CourseController = require('../../../app/core/course/course.controller');
const CourseModel = require('../../../app/core/course/course.model');
const TestDocuments = require('./course.data');
const error = require('../../../app/shared/error');

describe('CourseController', () => {
    beforeEach( () => {
        // test data
        this.docs = TestDocuments;

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

    describe('.loadConfig(req, res)', () => {
        it('should return HTTP 404 for invalid name', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);

            const req = {
                body: {
                    name: 'garbage'
                }
            };

            await CourseController.loadConfig(req, this.res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should return HTTP 404 if the language does not exist', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(this.docs[0]);

            const req = {
                body: {
                    name: this.docs[0].name,
                    language: 'garbage'
                }
            };

            await CourseController.loadConfig(req, this.res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        /* TODO: Jasmine says res.status() is not called
        it('should catch DB errors', async () => {
            sinon.stub(CourseModel, 'findOne').rejects('DBIO');

            const req = {
                body: {
                    name: CourseInstance.name,
                    language: CourseInstance.language
                }
            };

            await CourseController.loadConfig(req, this.res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 500);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBIO });
        });
        */

        it('should load the dummy course from the stub DB', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(this.docs[0]);

            const req = {
                body: {
                    name: this.docs[0].name,
                    language: this.docs[0].configs[0].language
                }
            };

            await CourseController.loadConfig(req, this.res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, this.docs[0].configs[0].config);
        });
    });

    describe('.showCourses(req, res)', () => {
        it('should show all available courses', async () => {
            sinon.stub(CourseModel, 'find').resolves(this.docs);

            const req = {
                // dummy
            };

            const expectedResult = [{
                "name": this.docs[0].name,
                "icon": this.docs[0].icon,
                "languages": [this.docs[0].configs[0].language]
            }];
            await CourseController.showCourses(req, this.res);
            sinon.assert.calledOnce(CourseModel.find);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, expectedResult);
        });
    });
});
