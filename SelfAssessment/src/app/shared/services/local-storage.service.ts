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

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  storeJournal(journal: Journal) {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journal.log)));
    localStorage.setItem('journalstructure', JSON.stringify(journal.structure));
  }

  storeJournalLog(journallog: JournalLog) {
    localStorage.setItem('journallog', JSON.stringify(this.prepareJournalLogForSaving(journallog)));
  }

  storePin(pin) {
    localStorage.setItem('pin', pin);
  }

  storeConfigFile(configFile: ConfigFile) {
    localStorage.setItem('configFile', JSON.stringify(configFile));
  }

  getPin(): number {
    return parseInt(localStorage.getItem('pin'), 0);
  }

  getConfigFile(): ConfigFile {
    return JSON.parse(localStorage.getItem('configFile'));
  }

  getJournalLog(): JournalLog {
    return this.extractSavedJournalLog(JSON.parse(localStorage.getItem('journallog')));
  }

  getJournalStructure(): JournalStructure {
    return JSON.parse(localStorage.getItem('journalstructure'));
  }

  getJournal(): Journal {
    const journal = new Journal();
    journal.log = this.getJournalLog();
    journal.structure = this.getJournalStructure();
    return journal;
  }

  prepareJournalLogForSaving(journalLog: JournalLog) {

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

  prepareJournalStructureForSaving(journalStructure: JournalStructure) {
    const rawSet: JournalStructureRaw = {
      course: this.getConfigFile().title,
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

  extractSavedJournalLog(protoObj) {
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


  createJournalStructure(course: ConfigFile, journalStrucRaw?: JournalStructureRaw) {
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
