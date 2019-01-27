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

    describe('PincodeController.create', () => {
        it('should create a pseudo-random pincode (8 digits)', async () => {
            sinon.stub(PincodeModel, 'find').resolves(docs);
            sinon.stub(PincodeModel, 'create').resolves(docs[0]);

            const req = {
                // dummy
            };

            await PincodeController.create(req, this.res);
            sinon.assert.calledOnce(PincodeModel.find);
            sinon.assert.calledOnce(PincodeModel.create);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 201);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, docs[0].pin);
        });
    });
});
