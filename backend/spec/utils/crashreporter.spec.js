const CrashReporter = require('../../app/utils/crashreporter');

describe('CrashReporter', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // dummy
    });

    describe('EmailTransport', () => {
        const instance = new CrashReporter.Transport.EmailTransport();

        describe('configure(host, port, secure, auth)', () => {
            it('should configure driver options', () => {
                const host = 'dummy';
                const port = 1234;
                const secure = false;
                const auth = {
                    user: 'dummy',
                    pass: 'dummy'
                }

                instance.configure(host, port, secure, auth);
    
                expect(instance.impl).not.toBeNull();
            });
        });

        describe('verify())', () => {
            it('should return false for dummy data', async () => {
                const result = await instance.verify();
    
                expect(result).toBeFalsy();
            });
        });

        describe('send(message))', () => {
            it('should return false for dummy data ', async () => {
                const result = await instance.send('dummy');
    
                expect(result).toBeFalsy();
            });
        });
    });

    describe('addTransport(transport))', () => {
        it('should return false for dummy transport', async () => {
            const transport = new CrashReporter.Transport.EmailTransport();
            const result = await CrashReporter.addTransport(transport);

            expect(result).toBeFalsy();
        });
    });
});
