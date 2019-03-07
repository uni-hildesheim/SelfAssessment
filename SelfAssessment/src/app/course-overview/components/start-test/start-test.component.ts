import { MaterialOverlayService } from '../../../shared/services/helper/material-overlay.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigFile } from 'src/app/shared/models/configuration/config.file.model';
import { ConfigService } from 'src/app/shared/services/config.service';
import { CodeService } from 'src/app/shared/services/code.service';
import { JournalService } from 'src/app/shared/services/journal/journal.service';
import { Journal } from 'src/app/shared/models/state/journal.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Course } from 'src/app/shared/models/configuration/course.model';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { switchMap, tap } from 'rxjs/operators';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

/**
 * The component displayed before the actual test procedure.
 */
@Component({
  selector: 'app-start-test',
  templateUrl: './start-test.component.html',
  styleUrls: ['./start-test.component.scss']
})
export class StartTestComponent implements OnInit {

  /**
   * The course.
   */
  public course: Course;

  /**
   * The help notes.
   */
  public notes: string[];

  /**
   * The pin.
   */
  public pin: number;

  public pinloading = true;

  /**
   * The desired language.
   */
  // public language: string;


  constructor(
    private configService: ConfigService,
    private router: Router,
    private pinService: CodeService,
    private journalService: JournalService,
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private materialOverlayService: MaterialOverlayService
  ) { }

  /**
   * Initalizes the variables.
   */
  ngOnInit() {
    this.pinService.createNewPin()
    .subscribe(pin => this.pin = pin)
    .add(() => this.pinloading = false);

    this.course = this.storageService.retrieveFromStorage(StorageItem.COURSE);

    this.notes = [];
    for (let i = 0; i < 5; i++) {
      this.notes[i] = `list-tips-${i + 1}`;
    }
  }

  /**
   * Start the selfassessment by loading the specific config file for the course and
   * saving the generated journal structure in the local storage.
   */
  public startSelfAssessment(): void {

    let refDialog;

    this.materialOverlayService
    .chooseCourseLanguage(this.course.languages, true)
    .pipe(
      tap(() => {
        refDialog = this.materialOverlayService.openLoadingDialog('Preparing test procedure');
      }),
      switchMap((language: string) => {
        this.storageService.persistInStorage(StorageItem.COURSE_LANGUAGE, language);
        return this.configService.loadConfigFromCourse(this.course.name, language)
        .pipe(
          switchMap((configFile: ConfigFile) => {
            const journal: Journal = this.configService.initJournalFromConfigFile(configFile);
            return this.journalService.saveJournal(journal);
          })
        );
      })
    ).subscribe(() => {
      refDialog.close();
      this.logging.info('Start the test procedure');
      this.router.navigateByUrl('/testpanel');
    });
  }
}
