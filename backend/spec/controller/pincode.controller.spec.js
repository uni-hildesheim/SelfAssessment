const sinon = require('sinon');

const PincodeController = require('../../app/controller/pincode.controller');
const PincodeModel = require('../../app/model/pincode.model');

describe('PincodeController', () => {
    const PincodeDocuments = [];
    const PincodeInstance = new PincodeModel({
        pin: 12345678,
        created: new Date()
    });
    PincodeDocuments.push(PincodeInstance);

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
            sinon.stub(PincodeModel, 'find').resolves(PincodeDocuments);
            sinon.stub(PincodeModel, 'create').resolves(PincodeDocuments[0]);

            const req = {
                // dummy
            };

            await PincodeController.create(req, this.res);
            sinon.assert.calledOnce(PincodeModel.find);
            sinon.assert.calledOnce(PincodeModel.create);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 201);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, PincodeDocuments[0].pin);
        });
    });
});
