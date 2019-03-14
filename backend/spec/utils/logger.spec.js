const Logger = require('../../app/utils/logger');

describe('Logger', () => {
    beforeEach( () => {
        // each test gets its own logger instance
        this.instance = Logger.create();
    });

    afterEach( () => {
        // dummy
    });

    describe('ConsoleTransport', () => {
        const instance = new Logger.Transport.ConsoleTransport();
        describe('log(level, message)', () => {
            it('should forward to console.log/warn/error', () => {
                spyOn(console, 'log');
                spyOn(console, 'warn');
                spyOn(console, 'error');
                instance.log(Logger.Level.ALL, 'dummy');
                instance.log(Logger.Level.WARN, 'dummy');
                instance.log(Logger.Level.ERROR, 'dummy');
    
                expect(console.log).toHaveBeenCalledTimes(1);
                expect(console.warn).toHaveBeenCalledTimes(1);
                expect(console.error).toHaveBeenCalledTimes(1);
            });
        });
    });

    /*
     * fileStream.write(..) is async, so not a good idea to test it here..
     *
    describe('FileTransport', () => {
        const testFileLocation = './dummy';
        const instance = new Logger.Transport.FileTransport(testFileLocation);

        describe('log(level, message) ', () => {
            it('should write the message to the file', () => {
                let contents;

                instance.log(Logger.Level.ALL, 'dummy');
                contents = fs.readFileSync(testFileLocation, 'utf8');
                fs.unlinkSync(testFileLocation);

                expect(contents).toEqual('dummy\n');
            });
        });
    });
    */

    describe('.transports (get)', () => {
        it('should return empty array', () => {
            expect(this.instance.transports).toEqual([]);
        });
    });

    describe('.log(level, message)', () => {
        it('should print to the console', () => {
            this.instance.addTransport(new Logger.Transport.ConsoleTransport(1));
            spyOn(console, 'log');

            this.instance.log(Logger.Level.ALL, 'message');

            expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/.+message/));
        });

        it('should get traces from stack if asked to', () => {
            this.instance.addTransport(new Logger.Transport.ConsoleTransport(1));
            this.instance.enableTracing();
            spyOn(console, 'log');

            this.instance.log(Logger.Level.ALL, 'message');

            expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/.+logger.spec.js.+message/));
        });

        it('should treat invalid level as ALL', () => {
            this.instance.addTransport(new Logger.Transport.ConsoleTransport(1));
            this.instance.enableTracing();
            spyOn(console, 'log');

            this.instance.log('INVALID', 'message');

            expect(console.log).toHaveBeenCalledWith(jasmine.stringMatching(/.+ALL.+message/));
        });
    });

    describe('.all()', () => {
        it('should forward to log(Logger.Level.ALL, ...)', () => {
            spyOn(this.instance, 'log');

            this.instance.all('dummy');

            expect(this.instance.log).toHaveBeenCalledWith(Logger.Level.ALL, 'dummy');
        });
    });

    describe('.error()', () => {
        it('should forward to log(Logger.Level.ERROR, ...)', () => {
            spyOn(this.instance, 'log');

            this.instance.error('dummy');

            expect(this.instance.log).toHaveBeenCalledWith(Logger.Level.ERROR, 'dummy');
        });
    });

    describe('.warn()', () => {
        it('should forward to log(Logger.Level.WARN, ...)', () => {
            spyOn(this.instance, 'log');

            this.instance.warn('dummy');

            expect(this.instance.log).toHaveBeenCalledWith(Logger.Level.WARN, 'dummy');
        });
    });

    describe('.info()', () => {
        it('should forward to log(Logger.Level.INFO, ...)', () => {
            spyOn(this.instance, 'log');

            this.instance.info('dummy');

            expect(this.instance.log).toHaveBeenCalledWith(Logger.Level.INFO, 'dummy');
        });
    });

    describe('.debug()', () => {
        it('should forward to log(Logger.Level.DEBUG, ...)', () => {
            spyOn(this.instance, 'log');

            this.instance.debug('dummy');

            expect(this.instance.log).toHaveBeenCalledWith(Logger.Level.DEBUG, 'dummy');
        });
    });

    describe('.setLogLevel(level)', () => {
        it('should not alter the level for invalid input', () => {
            const oldLevel = this.instance.level;
            this.instance.setLogLevel('0xdead');

            expect(this.instance.level).toBe(oldLevel);
        });

        it('should alter the level for string input', () => {
            const oldLevel = this.instance.level;
            const newLevel = oldLevel === Logger.Level.ALL ? Logger.Level.ERROR : Logger.Level.ALL;
            const newLevelString = Logger.Level.properties[newLevel].string;
            this.instance.setLogLevel(newLevelString);

            expect(this.instance.level).toBe(newLevel);
        });

        it('should alter the level for valid input', () => {
            const oldLevel = this.instance.level;
            const newLevel = oldLevel === Logger.Level.ALL ? Logger.Level.ERROR : Logger.Level.ALL;
            this.instance.setLogLevel(newLevel);

            expect(this.instance.level).toBe(newLevel);
        });
    });

    describe('.addTransport(transport)', () => {
        it('should add a new log transport to the internal set', () => {
            const consoleTransportInstance = new Logger.Transport.ConsoleTransport();
            this.instance.addTransport(consoleTransportInstance);

            expect(this.instance.transports).toEqual([consoleTransportInstance]);
        });

        it('should order transports by priority', () => {
            const consoleTransportInstance1 = new Logger.Transport.ConsoleTransport(2);
            const consoleTransportInstance2 = new Logger.Transport.ConsoleTransport(3);
            const consoleTransportInstance3 = new Logger.Transport.ConsoleTransport(1);
            this.instance.addTransport(consoleTransportInstance1);
            this.instance.addTransport(consoleTransportInstance2);
            this.instance.addTransport(consoleTransportInstance3);

            expect(this.instance.transports).toEqual([consoleTransportInstance2,
                consoleTransportInstance1, consoleTransportInstance3]);
        });
    });

    describe('.enableTracing()', () => {
        it('should enable tracing', () => {
            this.instance.enableTracing();

            expect(this.instance.tracing).toBeTruthy();
        });
    });

    describe('.disableTracing()', () => {
        it('should disable tracing', () => {
            this.instance.disableTracing();

            expect(this.instance.tracing).toBeFalsy();
        });
    });
});
