import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationOverviewComponent } from './components/evaluation-overview/evaluation-overview.component';
import { MaterialModule } from '../material/material.module';
import { ResultPipe } from './pipes/result.pipe';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [EvaluationOverviewComponent, ResultPipe],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule
  ]
})
export class EvaluationModule { }
