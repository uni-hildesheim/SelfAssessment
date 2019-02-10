const sinon = require('sinon');

const FrontendController = require('../../app/controller/frontend.controller');
const FrontendModel = require('../../app/model/frontend.model');

describe('FrontendController', () => {
    const docs = [{
        "name": "Selfassessment v1.0",
        "created": new Date(),
        "configs": [{
            "language": "English",
            "config": {
                "name": "Selfassessment v1.0",
                "header": "SelfAssessment",
                "footer": "&copy; 2019 Stiftung Universität Hildesheim",
                "vendor": {
                    "name": "Stiftung Universität Hildesheim",
                    "logo": "uni_hildesheim_logo.svg"
                },
                "strings": {
                    "language": "Language"
                },
                "language": "English"
            }
        }]
    }];

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

    describe('.resources(req, res)', () => {
        it('should return HTTP 404 for empty resource collection', async () => {
            sinon.stub(FrontendModel, 'find').resolves(null);

            const req = {
                // dummy
            };

            await FrontendController.resources(req, this.res);
            sinon.assert.calledOnce(FrontendModel.find);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
        });

        it('should load the dummy resource from the stub DB', async () => {
            sinon.stub(FrontendModel, 'find').resolves(docs);

            const req = {
                // dummy
            };

            await FrontendController.resources(req, this.res);
            sinon.assert.calledOnce(FrontendModel.find);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, docs[0].configs);
        });
    });
});
