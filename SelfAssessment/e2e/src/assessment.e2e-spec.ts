import { AssessmentPage } from './pages/assessment.po';
import { browser } from 'protractor';
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

    xit('should stay on start-test and should have a mat-card-action button', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentTestStartButton()).toBe(true);
    });

    xit('should stay on start-test and after the button click it display a mat-card-dialog', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        expect(page.isPresentTestLanguageSelection()).toBe(true);
    });

    xit('should select germany as language on the start-test and than should change the page to testpanel', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(browser.getCurrentUrl()).toMatch('/testpanel');
    });
// Testing the testpanel
    it('should stay on testpanel and should have a mat-header', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.isPresentMatHeader()).toBe(true);
    });

    it('should stay on testpanel and should have a mat-footer', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.isPresentMatFooter()).toBe(true);
    });

    it('should stay on testpanel and should have a app-main-panel', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.isPresentMainPanel()).toBe(true);
    });

    it('should stay on testpanel and should display a mat-horizontal stepper with more than zero elements', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.getMatStepperHeader().count()).toBeGreaterThanOrEqual(0);
    });

    it('should stay on testpanel and should display more than zero buttons', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.getTestPanelButtons().count()).toBeGreaterThanOrEqual(0);
    });
/**
    // Testing the content cards

    // Testing first infopage
    xit('should stay on testpanel and should display the infopage with the number 4002', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        expect(page.isPresentAppInfopage()).toBe(true);
        expect(page.getAppInfopageNumber()).toBe('4002');
    });

    // tests the first radio button test
    xit('should stay on testpanel and should display the first test card with multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        expect(page.getAppInfopageNumber()).toBe('1006');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });
    // The second radio button test
    xit('should stay on testpanel and should display the second test card with multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        expect(page.getTestCardNumber()).toBe('1007');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the third test card with multi-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1016');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });


     // The second infopage
     xit('should stay on testpanel and should display the second info page for motivation', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getAppInfopageNumber()).toBe('4003');
    });

    xit('should stay on testpanel and should display the test card four as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1008');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card five as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the main panel content by button click.
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1009');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card six as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1017');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });


    xit('should stay on testpanel and should display the thrid infopage card', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getAppInfopageNumber()).toBe('4004');
    });

    xit('should stay on testpanel and should display the test card seven as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1010');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card eight as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1011');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card nine as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();  // change the cards
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1012');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card ten as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1013');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card 11 as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1018');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the last infopage card', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();

        expect(page.getAppInfopageNumber()).toBe('4005');
    });
    // Before this tests the test must be start by click
    xit('should stay on testpanel and should display the test card 11 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1014');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    // Before this tests the test must be start by click
    xit('should stay on testpanel and should display the test card 12 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1015');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card 11 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // change the cards
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCardFiveTime();
        page.changeTestCard();
        page.changeTestCard();
        page.changeTestCard();

        expect(page.getTestCardNumber()).toBe('1019');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    // Now leaveing the testpanel
    // testing the evalution
    xit('should change the page to evaluation', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // Goeing through the test cards

        expect(browser.getCurrentUrl()).toMatch('/evaluation');
    });

    xit('should stay on the evalution page and should display the result', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // changing test-cards
        expect(page.isPresentEvalutionText()).toBe(true);
        page.clickEvaluationButton();
        expect(page.getExpensionPanel().count()).toBeGreaterThan(0);
    });

    // Testing the validation
    xit('should change the page to validation', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // There must be same test code
        page.clickEvaluationButton();
        page.clickValidationButton();

        expect(browser.getCurrentUrl()).toMatch('/validation');
    });

    xit('should stay on validation and should display the validation code', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        // There must be same test code
        page.clickEvaluationButton();
        page.clickValidationButton();
        expect(page.getValidationButtons().count()).toBeGreaterThanOrEqual(0);
        page.clickValditionCodeButton();
        expect(page.isPresentValidtionCode()).toBe(true);
    });
*/

});
