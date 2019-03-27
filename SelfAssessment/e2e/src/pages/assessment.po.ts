import { StartTestPage } from './start-test.po';
// this file presents the test assessment over the whole application
import {browser, element, by} from 'protractor';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';


export class AssessmentPage {
    navigateTo() {
        return browser.get('/dashboard');
    }
    // Checking the dashboard page
    checkForCourseCard() {
        return element(by.css('app-course-card')).isPresent();
    }

    getCourseCardElements() {
        return element.all(by.css('app-course-card'));
    }

    getAachenCourseCardTitle() {
        return element(by.cssContainingText('.coursename', 'Elektrotechnik und Informatik')).getText();
    }

    getAachenCourseCardButtonText() {
      return element(by.id('Elektrotechnik und Informatik')).getText();
    }
    clickAachenCourseCardButton() {
        return element(by.id('Elektrotechnik und Informatik')).click();
    }
    // Checking the start-test view
    isPresentMatCard() {
        return element(by.css('app-start-test mat-card')).isPresent();
    }

    getMatCardHeaderText() {
        return element(by.css('app-start-test mat-card mat-card-header div mat-card-title')).getText();
    }

    isPresentMatCardContent() {
        return element(by.css('app-start-test mat-card mat-card-content')).isPresent();
    }

    isPresentMatCardList() {
        return element(by.css('app-start-test mat-card mat-card-content div mat-list')).isPresent();
    }

    getMatCardListElements() {
        return element.all(by.css('app-start-test mat-card mat-card-content div mat-list'));
    }

    isPresentImg() {
        return element(by.css('app-start-test mat-card mat-card-content div img')).isPresent();
    }

    isPresentHeaderH4() {
        return element(by.css('app-start-test mat-card mat-card-content h4')).isPresent();
    }

    isPresentPinCode() {
        return element.all(by.css('app-start-test mat-card mat-card-content div')).get(1).isPresent();
    }

    isPresentMatAction() {
        return element(by.css('app-start-test mat-card mat-card-actions')).isPresent();
    }

    isPresentTestStartButton() {
       return element(by.css('.languageSelection')).isPresent();
    }

    clickTheStartTestButton() {
        return element(by.css('.languageSelection')).click();
    }
    // Find it outside the app
    isPresentTestLanguageSelection() {
        return element(by.css( '.mat-form-field')).isPresent();
    }

    clickTestLanguageSelection() {
        return element(by.css(' .mat-select-placeholder')).click();
    }

    getTestLanguageGermany() {
      return element.all(by.css('.mat-option-text')).get(0).getText();
    }

    clickTestLanguageGermany() {
      //  return element.all(by.css('.mat-option-ripple')).get(0).click();
      return element.all(by.cssContainingText('.mat-option-text', 'Deutsch')).click();
    }
    // checking the testpanel view
    isPresentMatHeader() {
        return element(by.css('app-header mat-toolbar')).isPresent();
    }

    isPresentMatFooter() {
        return element(by.css('app-footer')).isPresent();
    }

    isPresentMainPanel() {
        return element(by.css('div app-main-panel')).isPresent();
    }

    getMatStepperHeader() {
         return element.all(by.css('div app-main-panel mat-horizontal-stepper div mat-step-header'));
    }

    getTestPanelButtons() {
        return element.all(by.css('div app-main-panel button'));
    }
    // Testing the infopage card
    isPresentAppInfopage() {
        return element(by.css('app-main-panel app-infopage')).isPresent();
    }

    getAppInfopageNumber() {
        return element(by.css('.infopageID')).getText();
    }
    // Change the card
    changeTestCard() {
        return element(by.css('.changeCard')).click();
    }
    changeTestCardFiveTime() {
        element(by.css('.changeCard')).click();
        element(by.css('.changeCard')).click();
        element(by.css('.changeCard')).click();
        element(by.css('.changeCard')).click();
        return element(by.css('.changeCard')).click();
    }

    clickThroughAllTestCard() {
        element(by.css('.changecard')).click();
    }

    // testing the radiobuttons

    getTestCardNumber() {
        return element(by.css('.testcardID')).getText();
    }

    isPresentDescription() {
        return element(by.css('.description')).isPresent();
    }

    isPresentTask() {
        return element(by.css('.task')).isPresent();
    }
    // Radio buttons
    getRadioButtons() {
        return element.all(by.css('mat-radio-button'));
    }

    getMultiOptions() {
        return element.all(by.css('mat-radio-button'));
    }

    // Evaluation

    isPresentEvalutionText() {
        return element(by.css('mat-card mat-card-content')).isPresent();
    }

    isPresentEvalutionButton() {
        return element(by.css('.showEval')).isPresent();
    }
    clickEvaluationButton() {
        return element(by.css('.showEval')).click();
    }
    getExpensionPanel() {
        return element.all(by.css('app-evaluation-overview div mat-card mat-card-content mat-accordian mat-expansion-panel'));
    }

    clickValidationButton() {
        return element(by.css('showVal')).click();
    }
    getValidationButtons() {
        return element.all(by.css('app-validation div mat-card mat-card-actions button'));
    }

    clickValditionCodeButton() {
        return element.all(by.css('app-validation div mat-card mat-card-actions button')).get(1).click();
    }

    isPresentValidtionCode() {
        return element(by.css('app-validation div mat-card mat-card-content div')).isPresent();
    }
    // Validation


}
