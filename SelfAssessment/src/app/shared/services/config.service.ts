import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigFile } from '../models/config.file.model';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { Observable } from 'rxjs';
import { Course } from '../models/course-object';
import { LoggingService } from '../logging/logging.service';
import { tap } from 'rxjs/operators';

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
    private logging: LoggingService
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
    this.storageService.storeJournal(journal);
    return journal;
  }

  /**
  * If the user does not choose a course, but instead wants
  * to proceed by providing the pin, the corresponding journal
  * is fetched from the database.
  *
  * @param journal The journal containing the user specific state/setup.
  */
  public initJournalFromPin(journal: Journal): void {
    this.journalLogService.initJournalLogFromPin(journal.log);
    this.storageService.storeJournal(journal);
  }

}
