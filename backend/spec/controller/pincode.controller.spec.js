const sinon = require('sinon');

const PincodeController = require('../../app/controller/pincode.controller');
const UserModel = require('../../app/model/user.model');

describe('PincodeController', () => {
    const UserDocuments = [];
    const UserInstance = new UserModel({
        pin: 12345678,
        created: new Date()
    });
    UserDocuments.push(UserInstance);

    beforeEach( () => {
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

    describe('PincodeController.create', () => {
        it('should create a pseudo-random pincode (8 digits)', async () => {
            sinon.stub(UserModel, 'find').resolves(UserDocuments);
            sinon.stub(UserModel, 'create').resolves(UserDocuments[0]);

            const req = {
                // dummy
            };

            await PincodeController.create(req, this.res);
            sinon.assert.calledOnce(UserModel.find);
            sinon.assert.calledOnce(UserModel.create);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 201);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, UserDocuments[0].pin);
        });
    });
});
