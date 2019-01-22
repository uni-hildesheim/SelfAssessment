import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-formatted-text-area',
  templateUrl: './formatted-text-area.component.html',
  styleUrls: ['./formatted-text-area.component.scss']
})
export class FormattedTextAreaComponent implements OnInit, OnChanges {

  @Input() rawText: any;
  formattedText: string[];
  latexRegex = /\$\$([^\$]*)\$\$/g;

  constructor() { }

  ngOnInit() {
    this.formatEquations();
  }

  formatEquations() {
    this.rawText = ' ' + this.rawText;
    // use regex to split
    this.formattedText = this.rawText.split(this.latexRegex);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }
}
