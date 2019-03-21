import {browser, element, by } from 'protractor';

    export class EvaluationPage {
        navigateTo() {
            return browser.get('/evaluation');
        }

        isPresentMatCard() {
            return element(by.css('mat-card')).isPresent();
        }
    }
