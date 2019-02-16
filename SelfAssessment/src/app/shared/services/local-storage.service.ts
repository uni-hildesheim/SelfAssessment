import { Injectable } from '@angular/core';
import { JournalLog } from '../models/state/journal.log.model';
import { Journal } from '../models/state/journal.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { TestSet } from '../models/testspecific/testset.model';
import { Test } from '../models/testspecific/test.model';
import { Infopage } from '../models/testspecific/infopage.model';
import { ConfigFile } from '../models/config.file.model';
import { SetElement } from '../models/testspecific/set.element.model';
import { JournalStructureRaw } from '../models/state/raw/journal.structure.raw';
import { SetRaw } from '../models/state/raw/journal.struc.set.raw';
import { Course } from '../models/course-object';
import { Resource } from '../models/resources/resources.model';
import { resource } from 'selenium-webdriver/http';

/**
 * This Service contains the logic for storing/retrieving objects in/from
 * the local stroage and should be the only place where the storage is accessed.
 * It also provides helper methods for other storing use cases.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Stores a journal instance in the local storage.
   *
   * @param journal The journal instance.
   */
  public storeJournal(journal: Journal): void {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journal.log)));
    localStorage.setItem('journalstructure', JSON.stringify(journal.structure));
  }

  /**
   * Stores a journal log instance in the local storage.
   *
   * @param journallog The log instance.
   */
  public storeJournalLog(journallog: JournalLog): void {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journallog)));
  }

  /**
   * Stores the pin in the local storage.
   *
   * @param pin The pin.
   */
  public storePin(pin): void {
    localStorage.setItem('pin', pin.toString());
  }

  /**
   * Stores a course in the local storage.
   *
   * @param course The course.
   */
  public storeCourse(course: Course): void {
    localStorage.setItem('course', JSON.stringify(course));
  }

  /**
   * Retrieves the pin from the local storage.
   *
   * @returns The pin.
   */
  public getPin(): number {
    return parseInt(localStorage.getItem('pin'), 0);
  }

  /**
   * Retrieves the course from the local storage.
   *
   * @returns The course.
   */
  public getCourse(): Course {
    return JSON.parse(localStorage.getItem('course'));
  }

  /**
   * Retrieves the journal log from the local storage.
   *
   * @returns The journal log.
   */
  public getJournalLog(): JournalLog {
    return this.extractSavedJournalLog(JSON.parse(localStorage.getItem('journallog')));
  }

  /**
   * Retrieves the journal structure from the local storage.
   *
   * @returns The journal structure.
   */
  public getJournalStructure(): JournalStructure {
    return JSON.parse(localStorage.getItem('journalstructure'));
  }

  public clearStorage(): void {
    localStorage.clear();
  }

  public getLanguage(): string {
    return localStorage.getItem('language');
  }

  public storeLanguage(lang: string): void {
    localStorage.setItem('language', lang);
  }

  public storeResources(res: Resource[]): void {
    localStorage.setItem('resources', JSON.stringify(res));
  }

  public getAllResources(): Resource[] {
    return JSON.parse(localStorage.getItem('resources'));
  }

  public getResources(): Resource {

    let res: Resource;

    const lang = this.getLanguage();

    (<Resource[]>JSON.parse(localStorage.getItem('resources')))
      .forEach(element => {
        if (element.language === lang) {
          res = element;
        }
      });

    return res;
  }

  /**
   * Retrieves the complete journal from the local storage.
   *
   * @returns The journal
   */
  public getJournal(): Journal {
    const journal = new Journal();
    journal.log = this.getJournalLog();
    journal.structure = this.getJournalStructure();
    return journal;
  }

  /**
   * Helper method to format the journal log into a storable object,
   * because javascript maps cannot be stored in local storage and
   * cannot be send via http requests.
   *
   * @param journalLog The journal log.
   * @returns The prepared journal log.
   */
  public prepareJournalLogForSaving(journalLog: JournalLog): Object {

    const protoObj = new Object();
    protoObj['sets'] = [];

    journalLog.sets.forEach((element) => {
      const setObj = new Object();
      setObj['maps'] = [];
      element.forEach((val, key) => {
        setObj['maps'].push({ key, val });

      });
      protoObj['sets'].push(setObj);
    });

    return protoObj;
  }


  /**
   * Helper method to formate the journal structure into
   * a storable object.
   *
   * @param journalStructure The journal structure.
   */
  public prepareJournalStructureForSaving(journalStructure: JournalStructure): JournalStructureRaw {
    const rawSet: JournalStructureRaw = {
      course: this.getCourse().name,
      language: this.getLanguage(),
      sets: []
    };
    journalStructure.sets.forEach(set => {
      const setRaw: SetRaw = {
        set: set.id,
        tests: []
      };
      set.elements.forEach(element => {
        if (element.setType === 'test') {
          setRaw.tests.push(element.id);
        }
      });
      rawSet.sets.push(setRaw);
    });
    return rawSet;
  }

  /**
   * Helper method to extract the saved journal log from the local storage or
   * the database.
   *
   * @param rawLog The raw log object.
   * @returns The extracted journal log.
   */
  public extractSavedJournalLog(protoObj): JournalLog {
    const singleton = new JournalLog();
    singleton.sets = [];
    protoObj['sets'].forEach(set => {
      const protoSet = new Map<number, any[]>();
      set['maps'].forEach((obj) => {
        protoSet.set(obj.key, obj.val);
      });
      singleton.sets.push(protoSet);
    });
    return singleton;
  }

  /**
   * Creates a journal structure element from a course-specific
   * config file. This method is used in one of the two cases:
   *
   * 1. A new user starts the selfassessment test procedure.
   * 2. An existing user continues via pin input.
   *
   * The second case requires a raw journal structure element to
   * be provided, which was received from the backend.
   *
   * @param course  The course-specifig config file.
   * @param journalStrucRaw The raw journal structure.
   */
  public createJournalStructure(course: ConfigFile, journalStrucRaw?: JournalStructureRaw): JournalStructure {
    const journalStructure = new JournalStructure();
    const sets = [];
    const allSingleTests = new Map<number, SetElement>();
    const allInfopages = new Map<number, SetElement>();
    const testsInTestgroup = new Map<Number, SetElement[]>();
    const journalStrucRawTests = [];

    // find all user-specific randomly generated tests
    if (journalStrucRaw != null) {
      journalStrucRaw.sets.forEach((rawSet: SetRaw) => {
        rawSet.tests.forEach(element => {
          journalStrucRawTests.push(element);
        });
      });
    }

    // get all the single tests
    course.tests.forEach((rawTest: any) => {
      rawTest.setType = 'test';
      allSingleTests.set(rawTest.id, <Test>rawTest);
    });

    // get all the infopages
    course.infopages.forEach((page: any) => {
      page.setType = 'infopage';
      page.belongs.forEach(belongsId => {
        allInfopages.set(belongsId, <Infopage>page);
      });
    });

    // assign single tests to correct group
    course.testgroups.forEach((group: any) => {
      const temp = [];

      if (journalStrucRaw != null) {
        // the tests were already randomly generated
        group.tests.forEach(testId => {
          if (journalStrucRawTests.includes(testId)) {
            temp.push(allSingleTests.get(testId));
          }
        });
      } else if (group.select) {
        // if the select attribut exists, choose randomly
        const indices = [];
        while (indices.length < group.select) {
          const index = Math.floor(Math.random() * group.tests.length);
          if (!indices.includes(index)) {
            indices.push(index);
            temp.push(allSingleTests.get(group.tests[index]));
          }
        }
      } else {
        // otherwise use all tests in the group
        group.tests.forEach(testId => temp.push(allSingleTests.get(testId)));
      }
      testsInTestgroup.set(group.id, temp);
    });

    // finally create an array of the sets
    course.sets.forEach(rawSet => {

      const set = new TestSet();
      set.id = rawSet.id;
      set.elements = [];
      set.scoreIndepentText = rawSet['evaluationTexts']['scoreIndependent'];
      set.scoreDependentTexts = rawSet['evaluationTexts']['scoreDependent'];

      rawSet.elements.forEach(element => {

        // check if the single test/testgroup has a infopage
        if (allInfopages.has(element)) {
          set.elements.push(allInfopages.get(element));
        }

        if (allSingleTests.has(element)) {
          set.elements.push(allSingleTests.get(element));
        } else {
          testsInTestgroup.get(element).forEach(test => {

            // check if a test inside the testgroup has a infopage
            if (allInfopages.has(test.id)) {
              set.elements.push(allInfopages.get(test.id));
            }
            set.elements.push(test);
          });
        }
      });
      sets.push(set);
    });


    journalStructure.sets = sets;
    return journalStructure;
  }


}
