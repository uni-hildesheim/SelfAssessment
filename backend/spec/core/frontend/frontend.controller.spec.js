const sinon = require('sinon');

const FrontendController = require('../../../app/core/frontend/frontend.controller');
const FrontendModel = require('../../../app/core/frontend/frontend.model');
const TestDocuments = require('./frontend.data');
const error = require('../../../app/shared/error');

describe('FrontendController', () => {
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
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should load the dummy resource from the stub DB', async () => {
            sinon.stub(FrontendModel, 'find').resolves(this.docs);

            const req = {
                // dummy
            };

            await FrontendController.resources(req, this.res);
            sinon.assert.calledOnce(FrontendModel.find);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, this.docs[0].configs);
        });
    });
});
