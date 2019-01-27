import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinDialogComponent } from './components/dialogs/pin-dialog/pin-dialog.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormattedTextAreaComponent } from './components/formatted-text-area/formatted-text-area.component';
import { KatexModule } from 'ng-katex';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';


@NgModule({
  entryComponents: [PinDialogComponent, ErrorDialogComponent],
  declarations: [PinDialogComponent, FormattedTextAreaComponent, ErrorDialogComponent],
  imports: [
    CommonModule,
    KatexModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PinDialogComponent,
    ErrorDialogComponent,
    FormattedTextAreaComponent
  ]
})
export class SharedModule { }
