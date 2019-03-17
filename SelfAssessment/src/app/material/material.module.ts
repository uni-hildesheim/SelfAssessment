import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  MatStepperModule, MatCardModule, MatRadioModule, MatCheckboxModule,
  MatIconModule, MatButtonModule, MatProgressBarModule, MatGridListModule,
  MatListModule, MatToolbarModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
  MatSnackBarModule, MatChipsModule, MatOptionModule, MatSelectModule, MatExpansionModule,
  MatBottomSheetModule, MatTreeModule, MatBadgeModule, MatTooltipModule, MatTabsModule, MatSlideToggle, MatSlideToggleModule, MatMenuModule,
  MatTableModule, MatPaginatorModule

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
    MatListModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatMenuModule,
    DragDropModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class MaterialModule { }
