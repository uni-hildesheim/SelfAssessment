const GarbageCollector = require('../../app/utils/gc');

describe('GarbageCollector', () => {
    beforeEach( () => {
        // dummy
    });

    afterEach( () => {
        // reset GC engine
        GarbageCollector.reset();
    });

    describe('addTask(fn, params)', () => {
        it('should return false for fn objects other than functions', () => {
            const obj = {
                'something': 'some other thing'
            };

            const result = GarbageCollector.addTask(obj, '...');

            expect(result).toBeFalsy();
        });

        it('should return true for fn function objects', () => {
            const task = jasmine.createSpy('gcTask');
            const result = GarbageCollector.addTask(task);

            expect(result).toBeTruthy();
        });
    });

    describe('removeTask(fn)', () => {
        it('should return false for fn objects that are not part of the GC task list', () => {
            const task = jasmine.createSpy('gcTask');
            const anotherTask = jasmine.createSpy('gcTask2');
            const addResult = GarbageCollector.addTask(task);
            const removeResult = GarbageCollector.removeTask(anotherTask);

            expect(addResult).toBeTruthy();
            expect(removeResult).toBeFalsy();
        });

        it('should return true for tracked GC task', () => {
            const task = jasmine.createSpy('gcTask');
            const addResult = GarbageCollector.addTask(task);
            const removeResult = GarbageCollector.removeTask(task);

            expect(addResult).toBeTruthy();
            expect(removeResult).toBeTruthy();
        });
    });

    describe('start(interval)', () => {
        it('should start the GC engine', async () => {
            const task = jasmine.createSpy('gcTask');
            const result = GarbageCollector.addTask(task);

            // hack together a promise that sleeps
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            GarbageCollector.start(50);
            // sleep long enough to allow the GC task scheduler to kick in
            await sleep(75);

            expect(result).toBeTruthy();
            expect(task).toHaveBeenCalledTimes(1);
        });
    });

    describe('pause()', () => {
        it('should pause the GC engine', async () => {
            const task = jasmine.createSpy('gcTask');
            const result = GarbageCollector.addTask(task);

            // hack together a promise that sleeps
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            GarbageCollector.start(50);
            // sleep long enough to allow the GC task scheduler to kick in
            await sleep(75);

            // pause for long enough so the GC scheduler does not kick in
            GarbageCollector.pause(50);
            await sleep(75);

            expect(result).toBeTruthy();
            expect(task).toHaveBeenCalledTimes(1);
        });
    });

    describe('stop()', () => {
        it('should stop the GC engine', async () => {
            const task = jasmine.createSpy('gcTask');
            const result = GarbageCollector.addTask(task);

            // hack together a promise that sleeps
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            GarbageCollector.start(50);
            // sleep long enough to allow the GC task scheduler to kick in
            await sleep(75);

            GarbageCollector.stop();
            await sleep(75);

            expect(result).toBeTruthy();
            expect(task).toHaveBeenCalledTimes(1);
        });
    });

    describe('reset()', () => {
        it('should stop the GC engine and clear the task list', async () => {
            const task = jasmine.createSpy('gcTask');
            const result = GarbageCollector.addTask(task);

            // hack together a promise that sleeps
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            GarbageCollector.start(50);
            // sleep long enough to allow the GC task scheduler to kick in
            await sleep(75);

            GarbageCollector.reset();
            await sleep(75);

            expect(result).toBeTruthy();
            expect(task).toHaveBeenCalledTimes(1);
        });
    });
});
