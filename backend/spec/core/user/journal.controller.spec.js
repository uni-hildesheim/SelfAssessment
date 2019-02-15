const sinon = require('sinon');

const JournalController = require('../../../app/core/user/journal.controller');
const UserModel = require('../../../app/core/user/user.model');

describe('JournalController', () => {
    const UserInstance = new UserModel({
        pin: 12345678,
        journal: {
            log: 'dummy log',
            structure: 'dummy structure'
        }
    });

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

    describe('.loadLog(req, res)', () => {
        it('should return HTTP 404 for invalid pins ', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, { error: 'No user for pin: NaN' });
        });

        it('should load the dummy journal log from the stub DB', async () => {
            sinon.stub(UserModel, 'findOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: UserInstance.pin
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, UserInstance.journal.log);
        });
    });

    describe('.loadStructure(req, res)', () => {
        it('should return HTTP 404 for invalid pins  ', async () => {
            sinon.stub(UserModel, 'findOne').resolves(null);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, { error: 'No user for pin: NaN' });
        });

        it('should load the dummy journal structure from the stub DB', async () => {
            sinon.stub(UserModel, 'findOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: UserInstance.pin
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, UserInstance.journal.structure);
        });
    });

    describe('.saveLog(req, res)', () => {
        it('should create a new document for unknown pins ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: UserInstance.pin
                }
            };

            await JournalController.saveLog(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.saveLog(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });
    });

    describe('.saveStructure(req, res)', () => {
        it('should create a new document for unknown pins  ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: UserInstance.pin
                }
            };

            await JournalController.saveStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance  ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(UserInstance);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.saveStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });
    });
});
