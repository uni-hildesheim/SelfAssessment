const sinon = require('sinon');

const PincodeController = require('../../app/controller/pincode.controller');
const PincodeModel = require('../../app/model/pincode.model');

describe('PincodeController', () => {
    const docs = [
        {
            pin: 12345678,
            created: new Date()
        }
    ];

    beforeEach( () => {
        // stub out DB model methods
        sinon.stub(PincodeModel, 'find');
        sinon.stub(PincodeModel, 'create');
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

    describe('PincodeController.create', () => {
        it('should create a pseudo-random pincode (8 digits)', async () => {
            PincodeModel.find.resolves(docs);
            PincodeModel.create.resolves(docs[0]);

            const req = {};
            var res = {
                status: sinon.stub().returns({
                    json: sinon.spy()
                })
            };
            await PincodeController.create(req, res);
            sinon.assert.calledOnce(PincodeModel.find);
            sinon.assert.calledOnce(PincodeModel.create);
            sinon.assert.calledOnce(res.status);
            sinon.assert.calledWith(res.status, 201);
            sinon.assert.calledOnce(res.status().json);
        });
    });
});