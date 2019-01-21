import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinDialogComponent } from './components/dialogs/pin-dialog/pin-dialog.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  entryComponents: [PinDialogComponent],
  declarations: [PinDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    PinDialogComponent
  ]
})
export class SharedModule { }
