import { AssessmentPage } from './pages/assessment.po';
import { browser } from 'protractor';
// This test will cover the aachen selfassessment over the whole application

xdescribe('Aachen selfassessment view', () => {
    let page: AssessmentPage;

    beforeEach(() => {
         page =  new AssessmentPage();
         page.navigateTo();
    });
/**
    // First checking the dashboard view.
    it('should begin display course-cards', () => {
        expect(page.checkForCourseCard()).toBe(true);
    });

    it('should begin display more than zero course cards', () => {
        expect(page.getCourseCardElements().count()).toBeGreaterThan(0);
    });

    it('should display the aachen course card title', () => {
      expect(page.getAachenCourseCardTitle()).toBe('Elektrotechnik und Informatik');
    });

    it('should display the aachen course card button', () => {
        expect(page.getAachenCourseCardButtonText()).toBe('Start');
    });
    // Leave the view by button click
    it('should change the page to test-start', () => {
       page.clickAachenCourseCardButton();
        expect(browser.getCurrentUrl()).toMatch('/test-start;name=Elektrotechnik%20und%20Informatik;' +
        'icon=Aachen.jpg;languages=Deutsch,English');
    });
    // Second checking the start-test view
    it('should stay on start-test and should display a mat-card', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    it('should stay on start-test and should display a header content', () => {
        page.clickAachenCourseCardButton();
        expect(page.getMatCardHeaderText()).toBe('Important Information');
    });

    it('should stay on start-test and should display a mat-card-content', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    it('should stay on start-test and should display a mat-list with notes', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatCard()).toBe(true);
    });

    it('should stay on start-test and should display a mat-list with more than zero notes', () => {
        page.clickAachenCourseCardButton();
        expect(page.getMatCardListElements().count()).toBeGreaterThan(0);
    });

    it('should stay on start-test and should display a image', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentImg()).toBe(true);
    });

    it('should stay on start-test and should display a h4 header', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentHeaderH4()).toBe(true);
    });

    it('should stay on start-test and should display the pin-code', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentPinCode()).toBe(true);
    });

    it('should stay on start-test and should have a mat-card-action area', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentMatAction()).toBe(true);
    });

    it('should stay on start-test and should have a mat-card-action button', () => {
        page.clickAachenCourseCardButton();
        expect(page.isPresentTestStartButton()).toBe(true);
    });

    it('should stay on start-test and after the button click it display a mat-card-dialog', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        expect(page.isPresentTestLanguageSelection()).toBe(true);
    });

    it('should select germany as language on the start-test and than should change the page to testpanel', () => {
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
// Temporay the following tests only can run as single tests without the outher tests

    // Testing the content card
    // Testing first infopage
    it('should stay on testpanel and should display the infopage with the number 4001', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.isPresentAppInfopage()).toBe(true);
        expect(page.getAppInfopageNumber()).toBe('4001');
    });

    xit('should stay on testpanel and should display the right navigation side with a button', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();

        expect(page.getDivWithButton()).toBe(true);
    });

    // tests the first radio button test
    xit('should stay on testpanel and should display the first test card with multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        expect(page.getTestCardNumber()).toBe('1001');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    // The second radio button test
    xit('should stay on testpanel and should display the second test card with multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1002');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    it('should stay on testpanel and should display the third test card with multi-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1011');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });
     // The second infopage
    it('should stay on testpanel and should display the second info page for motivation', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getAppInfopageNumber()).toBe('4002');
    });

    it('should stay on testpanel and should display the test card four as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1003');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    it('should stay on testpanel and should display the test card five as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1004');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    it('should stay on testpanel and should display the test card six as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1012');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    it('should stay on testpanel and should display the third infopage card', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getAppInfopageNumber()).toBe('4003');
    });
// Checking the first math test
    it('should stay on testpanel and should display the test card seven as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getTestCardNumber()).toBe('1015');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

/**
 * The follewing e2e test are present, but are not working yet.
    xit('should stay on testpanel and should display the test card eight as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getTestCardNumber()).toBe('1005');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card nine as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getTestCardNumber()).toBe('1006');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card ten as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        expect(page.getTestCardNumber()).toBe('1007');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card 11 as multiple-options', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getTestCardNumber()).toBe('1008');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the last infopage card', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getAppInfopageNumber()).toBe('4003');
    });
/**
    // Before this tests the test must be start by click
    xit('should stay on testpanel and should display the test card 11 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        expect(page.getTestCardNumber()).toBe('1010');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    // Before this tests the test must be start by click
    xit('should stay on testpanel and should display the test card 12 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();


        expect(page.getTestCardNumber()).toBe('1011');
        expect(page.isPresentDescription()).toBe(true);
        expect(page.isPresentTask()).toBe(true);
        expect(page.getRadioButtons().count()).toBeGreaterThanOrEqual(0);
    });

    xit('should stay on testpanel and should display the test card 11 as speed test', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();


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
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        // Goeing through the test cards

        expect(browser.getCurrentUrl()).toMatch('/evaluation');
    });

    xit('should stay on the evalution page and should display the result', () => {
        page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        // changing test-cards
        expect(page.isPresentEvalutionText()).toBe(true);
        page.clickEvaluationButton();
        expect(page.getExpensionPanel().count()).toBeGreaterThan(0);
    });

    // Testing the validation
    xit('should change the page to validation', () => {
       page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();


        expect(browser.getCurrentUrl()).toMatch('/validation');
    });

    xit('should stay on validation and should display the validation code', () => {
       page.clickAachenCourseCardButton();
        page.clickTheStartTestButton();
        page.clickTestLanguageSelection();
        page.clickTestLanguageGermany();
        browser.pause();
        // change the main panel content by button click.
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        page.changeCardConentbyClickTheButton();
        browser.pause();

        // There must be same test code
        page.clickEvaluationButton();
        page.clickValidationButton();
        expect(page.getValidationButtons().count()).toBeGreaterThanOrEqual(0);
        page.clickValditionCodeButton();
        expect(page.isPresentValidtionCode()).toBe(true);
    });
    */
});
