import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvaluationOverviewComponent } from './components/evaluation-overview/evaluation-overview.component';
import { MaterialModule } from '../material/material.module';
import { ResultPipe } from './pipes/result.pipe';


@NgModule({
  declarations: [EvaluationOverviewComponent, ResultPipe],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EvaluationModule { }
