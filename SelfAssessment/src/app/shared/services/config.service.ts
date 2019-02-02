import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigFile } from '../models/config.file.model';
import { JournalLogService } from 'src/app/testpanel/services/journal-log.service';
import { Journal } from '../models/state/journal.model';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Course } from '../models/course-object';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  public static readonly SHOW_COURSES = environment.apiUrl + '/api/v1/course';
  public static readonly LOAD_CONFIG = environment.apiUrl + '/api/v1/course/loadConfig';

  constructor(
    private http: HttpClient,
    private journalLogService: JournalLogService,
    private storageService: LocalStorageService
  ) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(ConfigService.SHOW_COURSES);
  }

  loadConfigFromCourse(course: string): Observable<ConfigFile> {
    return this.http.post<ConfigFile>(ConfigService.LOAD_CONFIG, { name: course });
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



