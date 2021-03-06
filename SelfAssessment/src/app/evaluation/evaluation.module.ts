import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationOverviewComponent } from './components/evaluation-overview/evaluation-overview.component';
import { MaterialModule } from '../material/material.module';
import { ResultPipe } from './pipes/result.pipe';
import { SharedModule } from '../shared/shared.module';
import { TestResultPanelComponent } from './components/result-tree/result-tree.component';
import { OptionPipe } from './pipes/option.pipe';
import { ValidationComponent } from './components/validation/validation.component';
import { ScoreTextPipe } from './pipes/score-text.pipe';


@NgModule({
  declarations: [EvaluationOverviewComponent, ResultPipe, TestResultPanelComponent, OptionPipe, ValidationComponent, ScoreTextPipe],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class EvaluationModule { }
