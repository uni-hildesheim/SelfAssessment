import { ValidationPage } from './pages/validation.po';

describe('Validation view', function() {
    let page: ValidationPage;

    beforeEach(() => {
        page = new ValidationPage();
    });

    it('should have a header card', () => {
        page.navigateTo();
        expect(page.isPresentCardContent()).toBe(true);
    });

    it('should have a content card', () => {
        page.navigateTo();
        expect(page.isPresentCardContent()).toBe(true);
    });

    it('should have a card action', () => {
        page.navigateTo();
        expect(page.isPresentCardAction()).toBe(true);
    });

    it('should display more than zero buttons', () => {
        page.navigateTo();
        expect(page.getButtons().count()).toBeGreaterThan(0);
    });

    it('should show the code', () => {
        page.navigateTo();
        expect(page.isPresentCode()).toBe(true);
    });

});
