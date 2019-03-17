import { LanguageSpecificInfoText } from './../models/language.specific.infopage.text';
import { InfopageBlock } from './../models/infopage.block.model';
import { RadioButtons } from './../../shared/models/procedure/categories/radio.buttons.test';
import { Language } from 'src/app/admin/models/language.model';
import { LanguageSpecific } from './../models/language.specific.model';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { BehaviorSubject } from 'rxjs';
import { TestSet } from './../../shared/models/procedure/testset.model';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { Injectable } from '@angular/core';
import { BasicConfig } from '../models/basic.config.interface';
import { TestBlock } from '../models/test.block.model';
import { Match } from 'src/app/shared/models/procedure/categories/match.test';

@Injectable({
  providedIn: 'root'
})
export class ConfigDataService {

  public tests: BehaviorSubject<TestBlock[]>;
  public infopages: BehaviorSubject<InfopageBlock[]>;
  public sets: BehaviorSubject<TestSet[]>;
  public testgroups: BehaviorSubject<any[]>;
  public config: BasicConfig;

  constructor() {
    this.tests = new BehaviorSubject([]);
    this.testgroups = new BehaviorSubject([]);
    this.infopages = new BehaviorSubject([]);
    this.sets = new BehaviorSubject([]);
    this.config = {
      title: '',
      icon: '',
      schema: '',
      languages: []
    };
  }


  addLanguage() {
    const newLang = {
      id: this.createUniqueKey(this.config.languages, 'lang'),
      language: ''
    };
    this.config.languages.push(newLang);

    this.tests.getValue().forEach(test => {
      const langSpecific: LanguageSpecific = {
        language: newLang,
        description: 'description',
        options: [],
        task: 'task',
        type: 'logic'
      };

      test.langSpecific.push(langSpecific);
    });

    this.infopages.getValue().forEach(page => {
      const text: LanguageSpecificInfoText = {
        language: newLang,
        text: ''
      };

      page.text.push(text);
    });

  }


  removeLanguage(id) {
    this.config.languages = this.config.languages.filter(l => l.id !== id);

    this.tests.getValue().forEach(test => {
      test.langSpecific = test.langSpecific.filter(ls => ls.language.id !== id);
    });

    this.infopages.getValue().forEach(page => {
      page.text = page.text.filter(ls => ls.language.id !== id);
    });

  }

  createUniqueKey(arr: any[], property: string) {
    let i = 0;
    let key = `new_${property}_${i}`;
    while (arr.find(e => e.id === key)) {
      i++;
      key = `new_${property}_${i}`;
    }
    return key;
  }

  createFakeModel(obj: TestBlock, lang: Language) {

    const langSpec = obj.langSpecific.find(t => t.language.id === lang.id);

    if (obj.category.valueOf() === Category.MULTIPLE_OPTIONS.valueOf()) {
      return langSpec.options
        .map(o => langSpec.header.map(h => false));
    } else {


      console.log(langSpec.options.map(o => false));


      return langSpec.options.map(o => false);
    }

  }

  refreshTest() {
    this.tests.next(this.tests.getValue());
  }

  refreshTestgroup() {
    this.testgroups.next(this.testgroups.getValue());
  }

  refreshInfopage() {
    this.infopages.next(this.infopages.getValue());
  }

  refreshSets() {
    this.sets.next(this.sets.getValue());
  }


  getCurrentLangTest(lang: Language, testBlock: TestBlock): Test {


    if (testBlock.category.valueOf() === Category.RADIO_BUTTONS.valueOf()) {
      const test = new RadioButtons();
      test.category = testBlock.category;
      test.elementType = testBlock.elementType;
      test.evaluated = testBlock.evaluated;
      test.id = testBlock.id;
      const langSpec: LanguageSpecific = testBlock.langSpecific.find(ls => ls.language === lang);
      test.description = langSpec.description;
      test.options = langSpec.options;
      test.type = langSpec.type;
      test.task = langSpec.task;
      return test;
    } else if (testBlock.category.valueOf() === Category.MULTIPLE_OPTIONS.valueOf()) {
      const test = new MultipleOptions();
      test.category = testBlock.category;
      test.elementType = testBlock.elementType;
      test.evaluated = testBlock.evaluated;
      test.id = testBlock.id;
      const langSpec: LanguageSpecific = testBlock.langSpecific.find(ls => ls.language === lang);
      test.description = langSpec.description;
      test.options = langSpec.options;
      test.type = langSpec.type;
      test.header = langSpec.header;
      test.task = langSpec.task;
      return test;
    } else if(testBlock.category.valueOf() === Category.MATCH.valueOf()){
      const test = new Match();
      test.category = testBlock.category;
      test.elementType = testBlock.elementType;
      test.evaluated = testBlock.evaluated;
      test.id = testBlock.id;
      const langSpec: LanguageSpecific = testBlock.langSpecific.find(ls => ls.language === lang);
      test.description = langSpec.description;
      test.options = langSpec.options;
      test.type = langSpec.type;
      test.task = langSpec.task;
      return test;
    }


  }



}
