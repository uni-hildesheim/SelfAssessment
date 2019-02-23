import { LoggingService } from 'src/app/shared/logging/logging.service';
import { StorageItem } from './local.storage.values.enum';
import { Infopage } from './../models/procedure/infopage.model';
import { TestSet } from './../models/procedure/testset.model';
import { Test } from './../models/procedure/test.model';
import { SetElementType } from './../models/procedure/enums/element.type.enum';
import { JournalStructureMinimal } from './../models/state/minimal/journal.structure.minimal';
import { Injectable } from '@angular/core';
import { JournalLog } from '../models/state/journal.log.model';
import { Journal } from '../models/state/journal.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { ConfigFile } from '../models/configuration/config.file.model';
import { Course } from '../models/configuration/course.model';
import { Resource } from '../models/resources/resources.model';
import { TestSetMinimal } from '../models/state/minimal/test.set.minimal';
import { SetElement } from '../models/procedure/set.element.model';
import { Router } from '@angular/router';

/**
 * This Service contains the logic for storing/retrieving objects in/from
 * the local stroage and should be the only place where the storage is accessed.
 * It also provides helper methods for other storing use cases.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private logging: LoggingService,
    private router: Router
  ) { }

  public checkPinInStorage() {
    return localStorage.getItem(StorageItem.PIN);
  }

  public retrieveFromStorage(item: StorageItem): any {
    const result = JSON.parse(localStorage.getItem(item.valueOf()));

    if (!result) {
      // this.clearStorage();
      this.logging.warn(`could not retrieve ${item} from local storage`);
      this.logging.warn(`navigate back to index`);
      this.router.navigateByUrl('/');
    } else {
      // special case for journal log
      if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
        return this.extractSavedJournalLog(result);
      } else {
        return result;
      }
    }
  }

  public persistInStorage(item: StorageItem, value: any): any {
    // special case for the journal log because for some reason
    // javascript does not allow maps in the local storage
    if (item.valueOf() === StorageItem.JOURNAL_LOG.valueOf()) {
      localStorage.setItem(item.valueOf(), JSON.stringify(this.prepareJournalLogForSaving(value)));
    } else {
      localStorage.setItem(item.valueOf(), JSON.stringify(value));
    }
  }

  public retrieveJournal(): Journal {
    const journal = new Journal();
    journal.log = this.retrieveFromStorage(StorageItem.JOURNAL_LOG);
    journal.structure = this.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    return journal;
  }

  public persistJournal(journal: Journal) {
    console.log('HIER');
    this.persistInStorage(StorageItem.JOURNAL_LOG, journal.log);
    this.persistInStorage(StorageItem.JOURNAL_STRUCTURE, journal.structure);
  }


  public clearStorage(): void {
    localStorage.clear();
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
  public prepareJournalStructureForSaving(journalStructure: JournalStructure): JournalStructureMinimal {
    const rawSet: JournalStructureMinimal = {
      course: this.retrieveFromStorage(StorageItem.COURSE).name,
      language: this.retrieveFromStorage(StorageItem.COURSE_LANGUAGE),
      sets: []
    };
    journalStructure.sets.forEach(set => {
      const setRaw: TestSetMinimal = {
        set: set.id,
        tests: []
      };
      set.elements.forEach(element => {
        if (element.elementType.valueOf() === SetElementType.TEST.valueOf()) {
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
   * @param journalStrucMin The raw journal structure.
   */
  public createJournalStructure(course: ConfigFile, journalStrucMin?: JournalStructureMinimal): JournalStructure {
    const journalStructure = new JournalStructure();
    const sets = [];
    const allSingleTests = new Map<number, SetElement>();
    const allInfopages = new Map<number, SetElement>();
    const testsInTestgroup = new Map<Number, SetElement[]>();
    const journalStrucRawTests = [];

    // find all user-specific randomly generated tests
    if (journalStrucMin != null) {
      journalStrucMin.sets.forEach((rawSet: TestSetMinimal) => {
        rawSet.tests.forEach(element => {
          journalStrucRawTests.push(element);
        });
      });
    }

    // get all the single tests
    course.tests.forEach((rawTest: any) => {
      rawTest.elementType = SetElementType.TEST;
      allSingleTests.set(rawTest.id, <Test>rawTest);
    });

    // get all the infopages
    course.infopages.forEach((page: any) => {
      page.elementType = SetElementType.INFOPAGE;
      page.belongs.forEach(belongsId => {
        allInfopages.set(belongsId, <Infopage>page);
      });
    });

    // assign single tests to correct group
    course.testgroups.forEach((group: any) => {
      const temp = [];

      if (journalStrucMin != null) {
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
