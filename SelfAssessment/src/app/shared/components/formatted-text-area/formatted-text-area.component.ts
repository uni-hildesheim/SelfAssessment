import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

/**
 * Component which can be used to format text, e.g to filter latex expressions.
 */
@Component({
  selector: 'app-formatted-text-area',
  templateUrl: './formatted-text-area.component.html',
  styleUrls: ['./formatted-text-area.component.scss']
})
export class FormattedTextAreaComponent implements OnInit, OnChanges {

  /**
   * The unedited text from the config file.
   */
  @Input() rawText: any;

  /**
   * The formatted text.
   */
  formattedText: string[];

  /**
   * The regex to filter the latex expressions.
   */
  latexRegex = /\$\$([^\$]*)\$\$/g;

  constructor() { }

  /**
   * Reformat the equations if the component is reloaded.
   */
  ngOnInit() {
    this.formatEquations();
  }

  /**
   * Rerender the component if the input changes.
   */
  ngOnChanges() {
    this.ngOnInit();
  }

  /**
   * Format the text by filtering out the latex equations and
   * displaying them seperatly inside a ng-katex component.
   */
  formatEquations() {
    this.rawText = ' ' + this.rawText;
    // use regex to split
    this.formattedText = this.rawText.split(this.latexRegex);
  }

}
