import { browser, element, by } from 'protractor';

    export class ValidationPage {
        navigateTo() {
            return browser.get('/validation');
        }

        isPresentCardHeader() {
            return element(by.css('mat-card-header')).isPresent();
        }

        getTitleContent() {
            return element(by.css('.title')).getText();
        }

        isPresentCardContent() {
            return element(by.css('mat-card-content')).isPresent();
        }

        isPresentCardAction() {
            return element(by.css('mat-card-actions')).isPresent();
        }

        getButtons() {
            return element.all(by.css('button'));
        }

        isPresentCode() {
            return element(by.css('p')).isPresent();
        }
    }
