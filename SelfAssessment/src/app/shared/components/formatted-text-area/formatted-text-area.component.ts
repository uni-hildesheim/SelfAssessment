import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

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

  /**
   * The regex to find the images.
   */
  imgRegex = /``([^`]*)``/g;

  /**
   * The backend api url.
   */
  backendUrl = environment.apiUrl;

  constructor() { }

  /**
   * Reformat the equations if the component is reloaded.
   */
  ngOnInit() {
    this.formatImages();
    this.formatEquations();
  }

  /**
   * Rerender the component if the input changes.
   */
  ngOnChanges() {
    this.ngOnInit();
  }

  /**
   * Create the correct image path and set the attribute.
   */
  formatImages() {
    this.rawText = this.rawText.replace(this.imgRegex, `<img src=${this.backendUrl}/$1>`);
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
