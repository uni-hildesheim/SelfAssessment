import { DashboardPage } from './pages/dashboard.po';

describe('selfassessment dashboard view', function() {
    let page: DashboardPage;

    beforeEach(() => {
        page = new DashboardPage();
        page.navigateTo();
    });

    it('should display the pin code', () => {
        expect(page.isPresentAppPin()).toBeTruthy();
    });

    it('should display course cards', () => {
        expect(page.checkForCourseCard()).toBeTruthy();
    });

    it('should display more than zero course-cards', () => {
        expect(page.getCourseCardElements().count()).toBeGreaterThan(0);
    });

    it('should be able to perfom a click on a coure card', () => {
        const coursecard = page.getSingleCourseCard();
        expect(coursecard.click());
    });

});
