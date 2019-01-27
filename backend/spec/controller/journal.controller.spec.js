const sinon = require('sinon');

const JournalController = require('../../app/controller/journal.controller');
const JournalModel = require('../../app/model/journal.model');

describe('JournalController', () => {
    const docs = [
        {
            associatedPin: 12345678,
            log: 'dummy log',
            structure: 'dummy structure'
        }
    ];

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

    describe('.load(req, res)', () => {
        it('should return HTTP 404 for invalid pins', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(null);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.load(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, { error: 'No journal for pin: NaN' });
        });

        it('should load the dummy journal from the stub DB', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.load(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, docs[0]);
        });
    });

    describe('.loadLog(req, res)', () => {
        it('should return HTTP 404 for invalid pins', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(null);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, { error: 'No journal log for pin: NaN' });
        });

        it('should load the dummy journal log from the stub DB', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.loadLog(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, docs[0].log);
        });
    });

    describe('.loadStructure(req, res)', () => {
        it('should return HTTP 404 for invalid pins', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(null);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, { error: 'No journal structure for pin: NaN' });
        });

        it('should load the dummy journal structure from the stub DB', async () => {
            sinon.stub(JournalModel, 'findOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.loadStructure(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, docs[0].structure);
        });
    });

    describe('.save(req, res)', () => {
        it('should create a new document for unknown pins', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.save(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.save(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });
    });

    describe('.saveLog(req, res)', () => {
        it('should create a new document for unknown pins', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.saveLog(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.saveLog(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });
    });

    describe('.saveStructure(req, res)', () => {
        it('should create a new document for unknown pins', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: docs[0].associatedPin
                }
            };

            await JournalController.saveStructure(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should update the document instance', async () => {
            sinon.stub(JournalModel, 'updateOne').resolves(docs[0]);

            const req = {
                body: {
                    pin: 'dummy'
                }
            };

            await JournalController.saveStructure(req, this.res);
            sinon.assert.calledOnce(JournalModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().send);
        });
    });
});
