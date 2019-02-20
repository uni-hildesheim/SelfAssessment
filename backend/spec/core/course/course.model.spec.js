const sinon = require('sinon');

const CourseModel = require('../../../app/core/course/course.model');
const TestDocuments = require('./course.data');

describe('CourseModel', () => {
    beforeEach( () => {
        // test data
        this.docs = TestDocuments;
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });


    describe('.statics.validateConfig(config)', () => {
        it('should return false for invalid configs (invalid config meta)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            delete config.title;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (duplicated single test id)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['tests'][0]['id'] = config['tests'][1]['id'];
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (unknown test category)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['tests'][0]['category'] = '0xdead';
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (invalid single test config meta)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['tests'][0]['options'][0]['correct'] = 0;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (duplicated test group id)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['testgroups'][0]['id'] = config['testgroups'][1]['id'];
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (invalid reference in test group)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['testgroups'][0]['tests'][0] = 9999
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (duplicated test set id)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['sets'][0]['id'] = config['sets'][1]['id'];
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (invalid reference in test set)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['sets'][0]['elements'][1] = 9999
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (duplicated info page id)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['infopages'][0]['id'] = config['infopages'][1]['id'];
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return false for invalid configs (invalid reference in info page)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            config['infopages'][0]['belongs'][0] = 9999
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(false);
        });

        it('should return true for valid configs (no test groups)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            delete config.testgroups;
            // also need to remove test sets and infopages here because the sets include certain
            // testgroups and both may be referenced by info pages
            delete config.sets;
            delete config.infopages;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(true);
        });

        it('should return true for valid configs (no test sets)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            delete config.sets;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(true);
        });

        it('should return true for valid configs (no info pages)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            delete config.infopages;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(true);
        });

        it('should return true for valid configs (no info page elements)', () => {
            // ugly hack to perform a deep copy of the actual config
            const config = JSON.parse(JSON.stringify(this.docs[0].configs[0].config));

            delete config.infopages[0].belongs;
            const ret = CourseModel.validateConfig(config);

            expect(ret).toBe(true);
        });

        it('should return true for valid configs (unmodified)', () => {
            const ret = CourseModel.validateConfig(this.docs[0].configs[0].config);

            expect(ret).toBe(true);
        });
    });
});
