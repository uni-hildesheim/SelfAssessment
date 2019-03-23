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
        return element.all(by.css('app-course-card mat-card mat-card-footer p')).get(0).getText();
    }

    getAachenCourseCardButtonText() {
        return element.all(by.css('app-course-card mat-card mat-card-footer button')).get(1).getText();
    }

    getAachenCourseCardButton() {
        return element.all(by.css('app-course-card mat-card mat-card-footer button')).first();
    }
    clickAachenCourseCardButton() {
        return element.all(by.css('app-course-card mat-card mat-card-footer button')).first().click();
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
       //  return element(by.css('app-start-test mat-card mat-card-actions button')).isPresent();
       return element(by.css('.languageSelection')).isPresent();
    }

    clickTheStartTestButton() {
        return element(by.css('.languageSelection')).click();
    }

    isPresentMatDialog() {
        return element(by.css('mat-card-dialog')).isPresent();
    }

    getSelectionLanguageText() {
        return element.all(by.css('.languageSelection')).get(0).getText();
    }

    selectGermanyAsLanguage() {
        return element.all(by.css('.languageSelection')).first().click();
    }

    // checking the testpanel view
    isPresentMatHeader() {
        return element('app-header mat-toolbar').isPresent();
    }

    isPresentMatFooter() {
        return element('app-footer').isPresent();
    }

    isPresentMainPanel() {
        return element('div app-main-panel').isPresent();
    }

    getMatStepperHeader() {
         return element.all('div app-main-panel mat-horizontal-stepper div mat-step-header');
    }

    getTestPanelButtons() {
        return element.all('div app-main-panel button');
    }
    // Testing the infopage card
    isPresentAppInfopage() {
        return element('app-main-panel app-infopage').isPresent();
    }

    getAppInfopageNumber() {
        return element('.infopageID').getText();
    }
    // Change the card
    changeTestCard() {
        return element('.changeCard').click();
    }

    // testing the radiobuttons

    getTestCardNumber() {
        return element('.testcardID').getText();
    }

    isPresentDescription() {
        return element('.description').isPresent();
    }

    isPresentTask() {
        return element('.task').isPresent();
    }

    getRadioButtons() {
        return element.all('mat-radio-button');
    }

    getMultiOptions() {
        return element.all('mat-radio-button');
    }
}
