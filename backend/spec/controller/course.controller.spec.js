const sinon = require('sinon');

const CourseController = require('../../app/controller/course.controller');
const CourseModel = require('../../app/model/course.model');

describe('CourseController', () => {
    const CourseDocuments = [];
    const CourseInstance = new CourseModel({
        name: 'IMIT',
        language: 'en',
        configs: [{
            "title": "IMIT",
            "icon": "imit.png",
            "image": "",
            "validationSchema": "IMIT([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",

            "tests": [],
            "testgroups": [],
            "infopages": [],
            "sets": []
        }]
    });
    CourseDocuments.push(CourseInstance);

    beforeEach( () => {
        // common response object with spies
        this.res = {
            json: sinon.spy(),
            status: sinon.stub().returns({
                json: sinon.spy()
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
            sinon.assert.calledWith(this.res.status().json, { error: 'No such course: ' +
                                                              req.body.name });
        });

        it('should load the dummy course from the stub DB', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(CourseInstance);

            const req = {
                body: {
                    name: CourseInstance.name
                }
            };

            await CourseController.loadConfig(req, this.res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, CourseInstance.config);
        });
    });

    describe('.showCourses(req, res)', () => {
        it('should show all available courses', async () => {
            sinon.stub(CourseModel, 'find').resolves(CourseDocuments);

            const req = {
                // dummy
            };

            const expectedResult = [{
                "name": CourseDocuments[0].name,
                "icon": CourseDocuments[0].icon,
                "languages": [CourseDocuments[0].configs[0].language]
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
