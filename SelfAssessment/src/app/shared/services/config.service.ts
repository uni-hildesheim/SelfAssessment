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

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public static readonly SHOW_COURSES = 'api/v1/course';
  public static readonly LOAD_CONFIG = 'api/v1/course/loadConfig';

  constructor(
    private http: HttpClient,
    private journalLogService: JournalLogService,
    private storageService: LocalStorageService,
    private logging: LoggingService
  ) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(ConfigService.SHOW_COURSES)
    .pipe(
      tap(data => {
        this.logging.info('Loaded all courses');
        this.logging.debug(undefined, data, true);
      })
    );
  }

  loadConfigFromCourse(course: string): Observable<ConfigFile> {
    return this.http.post<ConfigFile>(ConfigService.LOAD_CONFIG, { name: course })
    .pipe(
      tap(data => {
        this.logging.info(`Loaded config for course: ${course}`);
        this.logging.debug(undefined, data);
      })
    );
  }

  initJournalFromConfigFile(configFile: ConfigFile) {
    const journal = new Journal();
    const journalStructure = this.storageService.createJournalStructure(configFile);
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


}



