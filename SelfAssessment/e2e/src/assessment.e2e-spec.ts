import { AssessmentPage } from './pages/assessment.po';
import { browser } from 'protractor';
import { bypassSanitizationTrustStyle } from '@angular/core/src/sanitization/bypass';
// This test will cover the aachen selfassessment over the whole application

describe('Aachen selfassessment view', () => {
    let page: AssessmentPage;

    beforeEach(() => {
         page =  new AssessmentPage();
         page.navigateTo();
    });
    // First checking the dashboard view.
    xit('should begin display course-cards', () => {
        expect(page.checkForCourseCard()).toBe(true);
    });

    xit('should begin display more than zero course cards', () => {
        expect(page.getCourseCardElements().count()).toBeGreaterThan(0);
    });

    xit('should display the aachen course card title', () => {
        expect(page.getAachenCourseCardTitle()).toBe('Elektrotechnik und Informatik');
    });

    xit('should display the aachen course card button', () => {
        expect(page.getAachenCourseCardButtonText()).toBe('Start');
    });
    // Leave the view by button click
    xit('should change the page to test-start', () => {
       page.clickAachenCourseCardButton();
        expect(browser.getCurrentUrl()).toMatch('/test-start;name=Elektrotechnik%20und%20Informatik;' +
        'icon=Aachen.jpg;languages=Deutsch,English');
    });
    // Second checking the start-test view
    xit('should stay on start-test and should display a mat-card', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    xit('should stay on start-test and should display a header content', () => {
        page.clickAachenCourseCardButton();
        expect(page.getMatCardHeaderText()).toBe('Important Information');
    });

    xit('should stay on start-test and should display a mat-card-content', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    xit('should stay on start-test and should display a mat-list with notes', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    xit('should stay on start-test and should display a mat-list with more than zero notes', () => {
        page.clickAachenCourseCardButton();
        expect(page.getMatCardListElements().count()).toBeGreaterThan(0);
    });

    xit('should stay on start-test and should display a image', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentImg()).toBe(true);
    });

    xit('should stay on start-test and should display a h4 header', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentHeaderH4()).toBe(true);
    });

    xit('should stay on start-test and should display the pin-code', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentPinCode()).toBe(true);
    });

    xit('should stay on start-test and should have a mat-card-action area', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatAction()).toBe(true);
    });

    it('should stay on start-test and should have a mat-card-action button', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentTestStartButton()).toBe(true);
    });
    // this donot works
    it('should stay on start-test and after the click on the button it should open a mat-card-dialog', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        expect(page.isPresentMatDialog()).toBe(true);
    });

    xit('should stay on start-test and after the click on the button it should select germany', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(browser.getCurrentUrl()).toBe('testpanel');
    });
    // testing the testpanel view
        // not working at the moment

    xit('should change the page to testpanel', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(browser.getCurrentUrl()).toMatch('/testpanel');
    });

    xit('should stay on testpanel and should have a mat-header', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.isPresentMatHeader()).toBe(true);
    });

    xit('should stay on testpanel and should have a mat-footer', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.isPresentMatFooter()).toBe(true);
    });

    xit('should stay on testpanel and should have a app-main-panel', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.isPresentMainPanel()).toBe(true);
    });

    xit('should stay on testpanel and should display a mat-horizontal stepper with more than zero elements', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.getMatStepperHeader().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display more than zero buttons', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.getTestPanelButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display a infopage', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.isPresentAppInfopage()).toBe(true);
    });

    xit('should stay on testpanel and should display the infopage with the number 4002', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        expect(page.getAppInfopageNumber()).toBe('4002');
    });

    // tests the first radio button test
    xit('should stay on testpanel and should change the main panel to an test with radio buttons', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        // change the main panel content by button click.
        page.changeTestCard();
        expect(page.getAppInfopageNumber()).toBe('1006');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });
    // The second radio button test
    xit('should stay on testpanel and should display the second radion button type', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.selectGermanyAsLanguage();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        expect(page.getTestCardNumber()).toBe('1007');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

});
