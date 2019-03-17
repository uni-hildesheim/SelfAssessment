import { LanguageSpecific } from './../../../models/language.specific.model';
import { TestBlock } from 'src/app/admin/models/test.block.model';
import { Language } from './../../../models/language.model';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { TestOption } from 'src/app/shared/models/procedure/testoption.model';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.scss']
})
export class CreateTestComponent implements OnInit {

  @Input() test: TestBlock;
  @Input() language: Language;
  langSpecific: LanguageSpecific;

  @Input() build: boolean;

  constructor() { }

  ngOnInit() {
    this.langSpecific = this.test.langSpecific.find(ls => ls.language.id === this.language.id);
  }

  addOption() {
    const opt: TestOption = {
      text: '',
      correct: false
    };
    this.langSpecific.options.push(opt);
  }
  deleteOpt(option) {
    this.langSpecific.options = this.langSpecific.options.filter(o => o !== option);
  }


  customTrackBy(index) {
    return index;
  }

  checkForMultipleOptions() {
    return this.test.category.valueOf() === Category.MULTIPLE_OPTIONS.valueOf();
  }

  addHeader() {
    this.langSpecific.header.push('');
  }

  deleteHeader(head) {
    this.langSpecific.header = this.langSpecific.header.filter(h => h !== head);
  }



}
