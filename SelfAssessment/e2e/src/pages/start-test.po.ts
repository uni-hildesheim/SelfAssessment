import { browser, element, by } from 'protractor';

    export class StartTestPage {
        navigateTo() {
            return browser.get('/test-start');
        }

        isPresentMatCardTitle() {
            return element(by.css('mat-card-title')).isPresent();
        }

        getMatCardTitleContent() {
            return element(by.css('title')).getText();
        }

        isPresentMatIcon() {
            return element(by.css('mat-icon')).isPresent();
        }

        isPresentImg() {
            return element(by.css('img')).isPresent();
        }

        isPresentButton() {
            return element(by.css('button')).isPresent();
        }

        isPresentMatCardAction() {
            return element(by.css('mat-card-actions')).isPresent();
        }
        getButtonElement() {
            return element(by.css('button'));
        }
    }
