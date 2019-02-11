import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PinDialogComponent } from './components/dialogs/pin-dialog/pin-dialog.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormattedTextAreaComponent } from './components/formatted-text-area/formatted-text-area.component';
import { KatexModule } from 'ng-katex';
import { ErrorDialogComponent } from './components/dialogs/error-dialog/error-dialog.component';
import { DefaultImgDirective } from './directives/default-image.directive';
import { CountdownComponent } from './components/countdown/countdown.component';
import { LanguagePipe } from './pipes/language.pipe';
import { ResourcePipe } from './pipes/resource.pipe';

/**
 * The shared module.
 *
 * Contains Components, Directives, Services and models used throughout the application.
 *
 */
@NgModule({
  entryComponents: [PinDialogComponent, ErrorDialogComponent],
  declarations: [PinDialogComponent, FormattedTextAreaComponent, ErrorDialogComponent,
    DefaultImgDirective, CountdownComponent, LanguagePipe, ResourcePipe],
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
    FormattedTextAreaComponent,
    DefaultImgDirective,
    CountdownComponent,
    LanguagePipe,
    ResourcePipe
  ]
})
export class SharedModule { }
