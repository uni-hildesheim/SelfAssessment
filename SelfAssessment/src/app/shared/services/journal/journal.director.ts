import { Journal } from '../../models/state/journal.model';
import { ConfigFile } from '../../models/configuration/config.file.model';
import { JournalStructureMinimal } from '../../models/state/minimal/journal.structure.minimal';
import { JournalLog } from '../../models/state/journal.log.model';
import { JournalStructure } from '../../models/state/journal.structure.model';
import { TestSetMinimal } from '../../models/state/minimal/test.set.minimal';
import { SetElementType } from '../../models/procedure/enums/element.type.enum';
import { Injectable } from '@angular/core';
import { SetElement } from '../../models/procedure/set.element.model';
import { Test } from '../../models/procedure/test.model';
import { Infopage } from '../../models/procedure/infopage.model';
import { TestSet } from '../../models/procedure/testset.model';
import { Category } from '../../models/procedure/enums/category.enum';
import { MultipleOptions } from '../../models/procedure/categories/multiple.options.test';

/**
 * Service that handles all tasks related to formatting and assembling the journal attributes.
 */
@Injectable({
    providedIn: 'root'
  })
export class JournalDirectorService {

    /**
     * Creates a new journal instance from a given configuration file.
     *
     * @param file The configuration file.
     * @returns The newly created journal instance.
     */
    public createJournal(file: ConfigFile): Journal {
        const journal = new Journal();
        journal.structure =  this.assembleJournalStructure(file);
        journal.log = this.assembleJournalLog(journal.structure);
        return journal;
    }

    /**
     * Creates a journal structure instance from a configuration file and a minimal journal
     * structure instance.
     *
     * @param file The configuration file.
     * @param minStruc The minimal journal structure instance.
     */
    public createJournalStructure(file: ConfigFile, minStruc: JournalStructureMinimal): JournalStructure {
        return this.assembleJournalStructure(file, minStruc);
    }

    /**
     * Formats a journal log instance into an object that can be stored in the local storage and the
     * database. Javascript maps cannot be stored.
     *
     * @param The journal log instance.
     * @returns The formatted journal log instance.
     */
    public prepareJournalLogForSaving(journalLog: JournalLog): Object {

        const log = new Object();
        log['sets'] = [];

        journalLog.sets.forEach((element) => {
          const set = new Object();
          set['maps'] = [];
          element.forEach((val, key) => {
            set['maps'].push({ key, val });

          });
          log['sets'].push(set);
        });

        return log;
      }

    /**
     * Creates a minimal journal structure instance from a journal structure.
     * To accurately represent the structure it is necessary to also pass the name of the course
     * and the choosen language.
     *
     * @param struc The journal structure instance.
     * @param name The name of the course.
     * @param lang The course language.
     * @returns The minimal representation of the structure.
     */
    public prepareJournalStructureForSaving(struc: JournalStructure, name: string, lang: string): JournalStructureMinimal {

        // create the minimal object
        const minStruc: JournalStructureMinimal = {
          course: name,
          language: lang,
          sets: []
        };

        minStruc.sets =  struc.sets
        .map(set => {
            const minSet: TestSetMinimal =  {
                set: set.id,
                tests: set.elements
                .filter(e => e.elementType.valueOf() === SetElementType.TEST.valueOf())
                .map(e => e.id)
            };
            return minSet;
        });

        return minStruc;
      }

    /**
     * Reformats a journal log object which was stored back to the acutal journal log instance.ö
     *
     * @param log The formatted journal log.
     * @returns The journal log instance.
     */
    public extractSavedJournalLog(log): JournalLog {

        const logObj = new JournalLog();
        logObj.sets = [];
        log['sets'].forEach(set => {
          const protoSet = new Map<string, any[]>();
          set['maps'].forEach((obj) => {
            protoSet.set(obj.key, obj.val);
          });
          logObj.sets.push(protoSet);
        });
        return logObj;
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
   * @param file  The course-specifig config file.
   * @param minJournalStruc The raw journal structure.
   */
  public assembleJournalStructure(file: ConfigFile, minJournalStruc?: JournalStructureMinimal): JournalStructure {
    const journalStructure = new JournalStructure();
    const sets = [];
    const allSingleTests = new Map<string, SetElement>();
    const allInfopages = new Map<string, SetElement>();
    const testsInTestgroup = new Map<string, SetElement[]>();
    const journalStrucRawTests = [];


    // find all user-specific randomly generated tests
    if (minJournalStruc != null) {
      minJournalStruc.sets.forEach((rawSet: TestSetMinimal) => {
        rawSet.tests.forEach(element => {
          journalStrucRawTests.push(element);
        });
      });
    }

    // get all the single tests
    file.tests.forEach((rawTest: any) => {
      rawTest.setType = 'test';
      rawTest.elementType = SetElementType.TEST;
      allSingleTests.set(rawTest.id, <Test>rawTest);
    });

    // get all the infopages
    file.infopages.forEach((page: any) => {
      page.setType = 'infopage';
      page.elementType = SetElementType.INFOPAGE;
      page.belongs.forEach(belongsId => {
        allInfopages.set(belongsId, <Infopage>page);
      });
    });

    // assign single tests to correct group
    file.testgroups.forEach((group: any) => {
      const temp = [];

      if (minJournalStruc != null) {
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
    file.sets.forEach(rawSet => {

      const set = new TestSet();
      set.id = rawSet.id;
      set.elements = [];
      set.scoreIndepentText = rawSet['evaluationTexts']['scoreIndependent'];
      set.scoreDependentTexts = rawSet['evaluationTexts']['scoreDependent'];

      // check if the set has an infopage
      if (allInfopages.has(set.id)) {
        set.elements.push(allInfopages.get(set.id));
      }

      rawSet.elements.forEach((element: string) => {

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

  /**
   * Assembles the journal log from a journal structure instance.
   *
   * @param struc The journal log structure.
   * @returns The created journal log instance.
   */
  public assembleJournalLog(struc: JournalStructure): JournalLog {
    const journalLog = new JournalLog();
    journalLog.sets = [];

    // each set has its own map with its single tests
    struc.sets.forEach(set => {
        const journalSet = new Map<string, any[]>();

        // extract all the single tests from the set, at this point
        // it does not matter if a test belongs to a testgroup
        set.elements.forEach((element: SetElement) => {
            if (element.elementType.valueOf() === SetElementType.TEST.valueOf()) {
              const optionsLength = (<Test>element).options.length;

                if ((<Test>element).category.valueOf() !== Category.MULTIPLE_OPTIONS.valueOf()) {
                    journalSet.set(element.id, new Array(optionsLength).fill(false));
                } else {
                    const temp = new Array(optionsLength);
                    for (let i = 0; i < temp.length; i++) {
                    temp[i] = new Array((<MultipleOptions>element).header.length).fill(false);
                    }
                    journalSet.set(element.id, temp);
                }
            }
        });
        journalLog.sets.push(journalSet);
    });

    return journalLog;
}




}
