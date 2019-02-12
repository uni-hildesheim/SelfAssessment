import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigFile } from 'src/app/shared/models/config.file.model';
import { ConfigService } from 'src/app/shared/services/config.service';
import { PinService } from 'src/app/shared/services/pin.service';
import { JournalService } from 'src/app/shared/services/journal.service';
import { Journal } from 'src/app/shared/models/state/journal.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Course } from 'src/app/shared/models/course-object';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { MatBottomSheet } from '@angular/material';
import { CourseLanguageBottomSheetComponent } from '../course-language-bottom-sheet/course-language-bottom-sheet.component';

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

  /**
   * The desired language.
   */
  // public language: string;


  constructor(
    private configService: ConfigService,
    private router: Router,
    private pinService: PinService,
    private journalService: JournalService,
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private bottomSheet: MatBottomSheet
  ) { }

  /**
   * Initalizes the variables.
   */
  ngOnInit() {

    this.pinService.createNewPin().subscribe(pin => this.pin = pin);

    this.course = this.storageService.getCourse();

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
    this.bottomSheet.open(CourseLanguageBottomSheetComponent,
      {
        data: this.course.languages,
        disableClose: true
      })
    .afterDismissed()
    .subscribe(
      (language: string) => {
      this.configService.loadConfigFromCourse(this.course.name, language)
      .subscribe(
        (configFile: ConfigFile) => {
          const journal: Journal = this.configService.initJournalFromConfigFile(configFile);
          this.journalService.saveJournalStructure(journal.structure)
            .subscribe(
              () => {
                this.logging.info('Start the test procedure');
                this.router.navigateByUrl('/testpanel');
              }
            );
        }
      );
    });
  }


}
