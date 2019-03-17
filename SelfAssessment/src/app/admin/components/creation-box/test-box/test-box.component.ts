import { LanguageSpecific } from './../../../models/language.specific.model';
import { Language } from './../../../models/language.model';
import { ConfigDataService } from '../../../services/config-data.service';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Category } from '../../../../shared/models/procedure/enums/category.enum';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { Component, OnInit } from '@angular/core';
import { MaterialOverlayService } from 'src/app/shared/services/helper/material-overlay.service';
import { TestBlock } from 'src/app/admin/models/test.block.model';

@Component({
  selector: 'app-radio-buttons-box',
  templateUrl: './test-box.component.html',
  styleUrls: ['./test-box.component.scss', '../box-style.scss']
})
export class TestBoxComponent implements OnInit {


  tests: TestBlock[];
  categories: Category[] = [
    Category.RADIO_BUTTONS,
    Category.MULTIPLE_CHOICE,
    Category.MULTIPLE_OPTIONS,
    Category.MATCH
  ];

  testInTestgroup: any[] = [];
  testInSet: any[] = [];
  doneTests: any[] = [];

  languages: Language[];


  constructor(
    private overlay: MaterialOverlayService,
    private configData: ConfigDataService
  ) { }


  ngOnInit() {
    this.tests = this.configData.tests.getValue();
    this.languages = this.configData.config.languages;
    this.configData.testgroups.subscribe(data => {
      this.testInTestgroup = [];
      data.forEach(d => {
        this.testInTestgroup = this.testInTestgroup.concat(d.tests);
      });
    });

    this.configData.sets.subscribe(data => {
      this.testInSet = [];
      data.forEach(d => {
        this.testInSet = this.testInSet.concat(d.elements);
      });
    });
  }

  checkForDoneTest(id) {
    return this.testInSet.concat(this.testInTestgroup).indexOf(id) !== -1;
  }


  addTestOfType(category: Category) {

    const id = this.configData.createUniqueKey(this.tests, 'test');

    const test: TestBlock = {
      category,
      elementType: SetElementType.TEST,
      id,
      evaluated: true,
      langSpecific: []
    };

    for (const lang of this.languages) {

      const langSpecific: LanguageSpecific = {
        language: lang,
        description: 'description',
        options: [],
        task: 'task',
        type: 'logic'
      };

      if (category === Category.MULTIPLE_OPTIONS) {
        langSpecific.header = [];
      }

      test.langSpecific.push(langSpecific);

    }

    this.tests.push(test);
    this.configData.refreshTest();

  }

  deleteTest(id) {
    this.tests = this.tests.filter(t => t.id !== id);
    this.configData.refreshTest();
  }


  buildTest(val) {
    this.overlay.openBuildTestDialog(val)
    .subscribe(data => {
      val = data;
      this.configData.refreshTest();
    });
  }

}
