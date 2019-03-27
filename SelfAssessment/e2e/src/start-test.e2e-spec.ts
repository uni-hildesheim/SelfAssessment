import { StartTestPage } from './pages/start-test.po';

describe('test-start view', function() {
        let page: StartTestPage;

        beforeEach(() => {
            page = new StartTestPage();
            page.navigateTo();
        });

        it('should have a mat-card-title', () => {
            expect(page.isPresentMatCardTitle()).toBe(true);
        });

        it('shouldnot display any content', () => {
            expect(page.getMatCardTitleContent()).toBe('');
        });

        it('should display a mat-icon', () => {
            expect(page.isPresentMatIcon()).toBe(true);
        });

        it('should display an image', () => {
            expect(page.isPresentImg()).toBe(true);
        });
        // This test doesnot works in the right way
        it('should have a mat-card-action', () => {
            expect(page.isPresentMatCardAction()).toBe(true);
        });

        it('should display a mat-flat-button', () => {
            expect(page.isPresentButton()).toBe(true);
        });

        it('should be able to perform a click on the button', () => {
            const button = page.getButtonElement();
            expect(button.isEnabled()).toBe(true);
        });

});
