const sinon = require('sinon');

const JournalController = require('../../../app/core/user/journal.controller');
const UserModel = require('../../../app/core/user/user.model');
const TestDocuments = require('./user.data');
const error = require('../../../app/shared/error');

describe('JournalController', () => {
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

    describe('.loadLog(req, res)', () => {
        it('should return HTTP 404 for invalid pins', async () => {
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
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should return HTTP 404 for missing journal', async () => {
            // ugly hack to perform a deep copy of the actual journal
            const user = JSON.parse(JSON.stringify(this.docs[0]));

            delete user.journal;
            sinon.stub(UserModel, 'findOne').resolves(user);

            const req = {
                body: {
                    pin: this.docs
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should load the dummy journal log from the stub DB', async () => {
            sinon.stub(UserModel, 'findOne').resolves(this.docs[0]);

            const req = {
                body: {
                    pin: this.docs[0].pin
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, this.docs[0].journal.log);
        });
    });

    describe('.loadStructure(req, res)', () => {
        it('should return HTTP 404 for invalid pins ', async () => {
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
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should return HTTP 404 for missing journal ', async () => {
            // ugly hack to perform a deep copy of the actual journal
            const user = JSON.parse(JSON.stringify(this.docs[0]));

            delete user.journal;
            sinon.stub(UserModel, 'findOne').resolves(user);

            const req = {
                body: {
                    pin: this.docs
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json,
                { error: error.ServerError.E_DBQUERY });
        });

        it('should load the dummy journal structure from the stub DB', async () => {
            sinon.stub(UserModel, 'findOne').resolves(this.docs[0]);

            const req = {
                body: {
                    pin: this.docs[0].pin
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, this.docs[0].journal.structure);
        });
    });

    describe('.saveLog(req, res)', () => {
        it('should create a new document for unknown pins ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(this.docs[0]);

            const req = {
                body: {
                    pin: this.docs[0].pin
                }
            };

            await JournalController.saveLog(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(this.docs[0]);

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
            sinon.stub(UserModel, 'updateOne').resolves(this.docs[0]);

            const req = {
                body: {
                    pin: this.docs[0].pin
                }
            };

            await JournalController.saveStructure(req, this.res);
            sinon.assert.calledOnce(UserModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance  ', async () => {
            sinon.stub(UserModel, 'updateOne').resolves(this.docs[0]);

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
