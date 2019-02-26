import { Test } from '../../models/procedure/test.model';
import { SetElementType } from '../../models/procedure/enums/element.type.enum';
import { Infopage } from '../../models/procedure/infopage.model';
import { SetElement } from '../../models/procedure/set.element.model';
import { ConfigFile } from '../../models/configuration/config.file.model';
import { TestSet } from '../../models/procedure/testset.model';
import { JournalStructure } from '../../models/state/journal.structure.model';
import { JournalLog } from '../../models/state/journal.log.model';
import { Category } from '../../models/procedure/enums/category.enum';
import { MultipleOptions } from '../../models/procedure/categories/multiple.options.test';
import { JournalStructureMinimal } from '../../models/state/minimal/journal.structure.minimal';
import { TestSetMinimal } from '../../models/state/minimal/test.set.minimal';

export class JournalBuilder {

    private buildTests(rawTests: any): Map<number, SetElement> {
        const tests = new Map<number, SetElement>();
        rawTests.forEach(test => {
            test.elementType = SetElementType.TEST;
            tests.set(test.id, <Test>test);
        });
        return tests;
    }

    private buildInfopages(rawInfopages: any): Map<number, SetElement> {
        const infopages = new Map<number, SetElement>();
        rawInfopages.forEach(page => {
            page.elementType = SetElementType.INFOPAGE;
            page.belongs.forEach(id => {
                infopages.set(id, <Infopage>page);
            });
        });
        return infopages;
    }

    private buildJournalStructureMinSets(journalStrucMin: JournalStructureMinimal) {
        const journalStrucRawTests = [];

        journalStrucMin.sets.forEach((rawSet: TestSetMinimal) => {
            rawSet.tests.forEach(id => {
            journalStrucRawTests.push(id);
            });
        });

        return journalStrucRawTests;
    }

    private buildTestgroups(rawTestgroups: any, tests: Map<number, SetElement>, min?: JournalStructureMinimal): Map<number, SetElement[]> {
        const testsInTestgroup = new Map<number, SetElement[]>();


        let journalStrucRawTests = [];
        if (min) {
            journalStrucRawTests = this.buildJournalStructureMinSets(min);
        }

        rawTestgroups.forEach((group: any) => {
            const temp = [];

            if (min) {
                // the tests were already randomly generated
                group.tests.forEach(testId => {
                  if (journalStrucRawTests.includes(testId)) {
                    temp.push(tests.get(testId));
                  }
                });
              } else if (group.select) {
              // if the select attribut exists, choose randomly
              const indices = [];
              while (indices.length < group.select) {
                const index = Math.floor(Math.random() * group.tests.length);
                if (!indices.includes(index)) {
                  indices.push(index);
                  temp.push(tests.get(group.tests[index]));
                }
              }
            } else {
              // otherwise use all tests in the group
              group.tests.forEach(testId => temp.push(tests.get(testId)));
            }
            testsInTestgroup.set(group.id, temp);
          });
          return testsInTestgroup;
    }


    public assembleJournalStructure(file: ConfigFile, minStruc?: JournalStructureMinimal): JournalStructure {

        const journalStructure = new JournalStructure();
        journalStructure.sets = [];

        const tests = this.buildTests(file.tests);
        const infopages = this.buildInfopages(file.infopages);
        const testgroups = this.buildTestgroups(file.testgroups, tests, minStruc);

        file.sets.forEach(rawSet => {

            const set = new TestSet();
            set.id = rawSet.id;
            set.elements = [];
            set.scoreIndepentText = rawSet['evaluationTexts']['scoreIndependent'];
            set.scoreDependentTexts = rawSet['evaluationTexts']['scoreDependent'];

            rawSet.elements.forEach(element => {
              // check if the single test/testgroup has a infopage
              if (infopages.has(element)) {
                set.elements.push(infopages.get(element));
              }
              if (tests.has(element)) {
                set.elements.push(tests.get(element));
              } else {
                testgroups.get(element).forEach(test => {

                  // check if a test inside the testgroup has a infopage
                  if (infopages.has(test.id)) {
                    set.elements.push(infopages.get(test.id));
                  }
                  set.elements.push(test);
                });
              }
            });
            journalStructure.sets.push(set);
          });

          return journalStructure;
    }

    public assembleJournalLog(struc: JournalStructure): JournalLog {

        const journalLog = new JournalLog();
        journalLog.sets = [];

        // each set has its own map with its single tests
        struc.sets.forEach(set => {
            const journalSet = new Map<number, any[]>();

            // extract all the single tests from the set, at this point
            // it does not matter if a test belongs to a testgroup
            set.elements.forEach((element: SetElement) => {
                if (element.elementType.valueOf() === SetElementType.TEST.valueOf()) {
                    if ((<Test>element).category.valueOf() !== Category.MULTIPLE_OPTIONS.valueOf()) {
                        journalSet.set(element.id, new Array((<Test>element).options.length).fill(false));
                    } else {
                        const temp = new Array((<Test>element).options.length);
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


    getSetElement(id, file) {
      const test = file.tests.filter(t => t.id === id);
      if (!test) {
          return file.infopages.filter(i => i.id === id)[0] as Infopage;
      }
      return test[0] as Test;
  }

  getSetElementGrouping(id, testgroups, file) {
      const group = testgroups
      .filter(g => g.id === id)[0];
      return (group) ? group.tests : this.getSetElement(id, file);
  }


}
