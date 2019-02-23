import { JournalLog } from './../models/state/journal.log.model';
import { ResultService } from './../../evaluation/services/result.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigFile } from '../models/configuration/config.file.model';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { Observable, of } from 'rxjs';
import { Course } from '../models/configuration/course.model';
import { LoggingService } from '../logging/logging.service';
import { tap } from 'rxjs/operators';
import { ResultSet } from '../models/evaluation/result.set';
import { StorageItem } from './local.storage.values.enum';

/**
 * Handles the overall configuration logic, to setup the application for
 * the continuing test procedure.
 * Retrieves course specific information from the database and initializes
 * the pivotal journal instance.
 * This can happen either by choosing a course from the dashboard or by
 * providing the pin.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  /**
   * Api route that retrieves all courses.
   */
  public static readonly SHOW_COURSES = 'api/v1/course';

  /**
   * Api route that loads a config file for a specific course.
   */
  public static readonly LOAD_CONFIG = 'api/v1/course/loadConfig';

  constructor(
    private http: HttpClient,
    private journalLogService: JournalLogService,
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private resultService: ResultService
  ) { }

  /**
   * Fetches all the stored courses from the database.
   *
   * @returns Observable containing the courses.
   */
  public getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(ConfigService.SHOW_COURSES)
      .pipe(
        tap(data => {
          this.logging.info('Loaded all courses');
          this.logging.debug(undefined, data, true);
        })
      );
  }

  /**
  * Fetches the course-specific configuration.
  *
  * @param course The course to fetch.
  * @returns Observable containing the config file.
  */
  public loadConfigFromCourse(course: string, language: string): Observable<ConfigFile> {
    return this.http.post<ConfigFile>(ConfigService.LOAD_CONFIG, { name: course, language: language })
      .pipe(
        tap(data => {
          this.logging.info(`Loaded course config: ${course} for language: ${language}`);
          this.logging.debug(undefined, data);
        })
      );
  }

  /**
  * Every journal is initalized with the specific configuration for
  * the course which was choosen by the user.
  *
  * @param configFile The course affiliated config file.
  * @returns The generated journal.
  */
  public initJournalFromConfigFile(configFile: ConfigFile): Journal {
    const journal = new Journal();
    const journalStructure = this.storageService.createJournalStructure(configFile);
    const journalLog = this.journalLogService.initJournalLog(journalStructure);
    journal.log = journalLog;
    journal.structure = journalStructure;
    this.storageService.persistJournal(journal);
    return journal;
  }

  /**
  * Inits the journal log service using the log which
  * was retrieved with the users pin.
  *
  * @param journal The journal log containing the users specific state/setup.
  */
  public initJournalLogFromPin(journalLog: JournalLog): void {
    this.journalLogService.initJournalLogFromPin(journalLog);
  }

  /**
   * Inits the evaluation instance stored in the result service
   * using the result set instance which was retrieved with the
   * the users pin.
   *
   * @param The result set.
   */
  public initEvaluationFromPin(resultSet: ResultSet[]) {
   this.resultService.initResultServiceFromPin(resultSet);
  }

}
