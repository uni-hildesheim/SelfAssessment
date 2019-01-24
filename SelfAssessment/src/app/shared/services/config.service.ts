import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Test } from 'src/app/shared/models/testspecific/test.model';
import { Infopage } from 'src/app/shared/models/testspecific/infopage.model';
import { TestSet } from 'src/app/shared/models/testspecific/testset.model';
import { SetElement } from 'src/app/shared/models/testspecific/set.element.model';
import { ConfigFile } from '../models/config.file.model';
import { JournalStructure } from '../models/state/journal.structure.model';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private static readonly SHOW_COURSES = environment.apiUrl + '/api/v1/course';
  private static readonly LOAD_CONFIG = environment.apiUrl + '/api/v1/course/loadConfig';

  constructor(
    private http: HttpClient,
    private journalLogService: JournalLogService,
    private storageService: LocalStorageService
  ) { }

  getAllCourses() {
    return this.http.get(ConfigService.SHOW_COURSES);
  }

  loadConfigFromCourse(course: string) {
    return this.http.post(ConfigService.LOAD_CONFIG, { name: course });
  }

  initJournalFromConfigFile(configFile: ConfigFile) {
    const journal = new Journal();
    const journalStructure = this.createJournalStructureFromConfigFile(configFile);
    const journalLog = this.journalLogService.initJournalLog(journalStructure);
    journal.log = journalLog;
    journal.structure = journalStructure;
    this.storageService.storeJournal(journal);
    return journal;
  }

  initJournalFromPin(journal: Journal) {
    this.journalLogService.initJournalLogFromPin(journal.log);
    this.storageService.storeJournal(journal);
  }

  createJournalStructureFromConfigFile(course: ConfigFile): JournalStructure {
    const journalStructure = new JournalStructure();
    const sets = [];
    const allSingleTests = new Map<number, SetElement>();
    const allInfopages = new Map<number, SetElement>();
    const testsInTestgroup = new Map<Number, SetElement[]>();

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

      if (group.select) {
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



