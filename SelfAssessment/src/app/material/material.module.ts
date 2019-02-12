import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatStepperModule, MatCardModule, MatRadioModule, MatCheckboxModule,
  MatIconModule, MatButtonModule, MatProgressBarModule, MatGridListModule,
  MatListModule, MatToolbarModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
  MatSnackBarModule, MatChipsModule, MatOptionModule, MatSelectModule, MatExpansionModule,
  MatBottomSheetModule, MatTreeModule, MatBadgeModule,
} from '@angular/material';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  exports: [
    MatStepperModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatGridListModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatTreeModule,
    MatBadgeModule
  ]
})
export class MaterialModule { }
