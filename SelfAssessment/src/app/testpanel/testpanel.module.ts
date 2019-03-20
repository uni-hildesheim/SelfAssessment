import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { SingleTestCardComponent } from './components/single-test-card/single-test-card.component';
import { MaterialModule } from '../material/material.module';
import { GlobalIndicator } from './global.indicators';
import { InfopageComponent } from './components/infopage/infopage.component';
import { SharedModule } from '../shared/shared.module';
import { RadioButtonsComponent } from './components/single-test-card/categories/radio-buttons/radio-buttons.component';
import { MultipleOptionsComponent } from './components/single-test-card/categories/multiple-options/multiple-options.component';
import { MultipleChoiceComponent } from './components/single-test-card/categories/multiple-choice/multiple-choice.component';
import { TestDirective } from './components/single-test-card/test.directive';
import { MatchComponent } from './components/single-test-card/categories/match/match.component';

/**
 * Main module which implements the actual testing procedure.
 */
@NgModule({
  entryComponents: [ MatchComponent, RadioButtonsComponent, MultipleOptionsComponent, MultipleChoiceComponent ],
  declarations: [MainPanelComponent, SingleTestCardComponent, InfopageComponent,
    MatchComponent, RadioButtonsComponent, MultipleOptionsComponent, MultipleChoiceComponent, TestDirective],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ],
  providers: [
    GlobalIndicator
  ],
  exports: [
    MainPanelComponent
  ]
})
export class TestpanelModule { }
