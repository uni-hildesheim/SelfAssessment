const sinon = require('sinon');

const CourseController = require('../../app/controller/course.controller');
const CourseModel = require('../../app/model/course.model');

describe('CourseController', () => {
    const docs = [
        {
            name: 'IMIT',
            config: {
                "title": "IMIT",
                "image": "",
                "checksum_regex": "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",

                "tests": [],
                "testgroups": [],
                "infopages": [],
                "sets": []
            },
            structure: 'dummy structure'
        }
    ];

    beforeEach( () => {
        // stub out DB model methods
        sinon.stub(CourseModel, 'find');
        sinon.stub(CourseModel, 'findOne');
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

    describe('.loadConfig(req, res)', () => {
        it('should return HTTP 404 for invalid name', async () => {
            CourseModel.findOne.resolves(null);
            const req = {
                body: {
                    name: 'garbage'
                }
            };
            const res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            await CourseController.loadConfig(req, res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, { error: 'No such course: ' +
                                                         req.body.name });
        });

        it('should load the dummy course from the stub DB', async () => {
            CourseModel.findOne.resolves(docs[0]);
            const req = {
                body: {
                    name: docs[0].name
                }
            };
            var res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            await CourseController.loadConfig(req, res);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, docs[0].config);
        });
    });

    describe('.showCourses(req, res)', () => {
        it('should show all available courses', async () => {
            CourseModel.find.resolves(docs);
            const req = {
                // dummy
            };
            const res = {
                status: sinon.stub().returns({
                    json: sinon.spy(),
                    send: sinon.spy()
                })
            };
            const expectedNames = [ docs[0].name ];
            await CourseController.showCourses(req, res);
            sinon.assert.calledOnce(CourseModel.find);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, expectedNames);
        });
    });
});
