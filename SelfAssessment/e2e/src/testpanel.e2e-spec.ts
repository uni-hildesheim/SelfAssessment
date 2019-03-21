import { TestpanelPage } from './pages/testpanel.po';
/**
 * This testfile tests the testpanelpage without the impact of a loading config file.
 */
describe('Testpanel view', function() {
    let page: TestpanelPage;

    beforeEach(() => {
        page = new TestpanelPage();
        page.navigateTo();
    });

    it('should not have a mat-step', () => {
        expect(page.isPresentMatStep()).toBe(false);
    });

    it('should have some buttons', () => {
        expect(page.isPresentButtons()).toBe(true);
    });

    it('should display more than zero buttons', () => {
        expect(page.getAllButtons().count()).toBeGreaterThan(0);
    });

    it('should not have any mat-progress-bars', () => {
        expect(page.isPresentMatProgressBar()).toBe(false);
    });

    it('should display zero mat-progress-bars', () => {
        expect(page.getAllMatProgressBar().count()).toBe(0);
    });

    it('should have some mat-icons', () => {
        expect(page.isPresentMatIcon()).toBe(true);
    });

    it('should display more than zero mat-icons', () => {
        expect(page.getAllMatIcon().count()).toBeGreaterThanOrEqual(1);
    });
});
