const sinon = require('sinon');

const JournalController = require('../../app/controller/journal.controller');
const JournalModel = require('../../app/model/journal.model');

describe('JournalController', () => {
    const docs = [
        {
            associatedPin: 12345678,
            data: 'dummy'
        }
    ];

    beforeEach( () => {
        // stub out DB model methods
        sinon.stub(JournalModel, 'findOne');
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

    describe('JournalController.load', () => {
        it('should return HTTP 404 for invalid pins', async () => {
            JournalModel.findOne.resolves(null);
            const req = {
                body: {
                    pin: 'dummy'
                }
            };
            const res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            await JournalController.load(req, res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 404);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, { error: 'No journal for pin: NaN' });
        });

        it('should load the dummy journal from the stub DB', async () => {
            JournalModel.findOne.resolves(docs[0]);
            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };
            var res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            await JournalController.load(req, res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 200);
            sinon.assert.calledOnce(res.status().json);
            sinon.assert.calledWith(res.status().json, docs[0]);
        });
    });
});
