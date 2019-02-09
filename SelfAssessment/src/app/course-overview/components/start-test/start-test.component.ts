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
   * The information content.
   */
  public infoContent: string;

  /**
   * The label for the notes.
   */
  public notesLbl: string;

  /**
   * The encouragement.
   */
  public encouragement: string;

  /**
   * The pin note.
   */
  public pinNote: string;

  /**
   * The start test lbl.
   */
  public startTestLbl: string;

  /**
   * The pin.
   */
  public pin: number;


  constructor(
    private configService: ConfigService,
    private router: Router,
    private pinService: PinService,
    private journalService: JournalService,
    private storageService: LocalStorageService,
    private logging: LoggingService
  ) { }

  /**
   * Initalizes the variables.
   */
  ngOnInit() {

    this.pinService.createNewPin().subscribe(pin => this.pin = pin);

    this.course = this.storageService.getCourse();

    this.notes = [
      'Plane in etwa 60 Minuten für eine gewissenhafte Bearbeitung ein!',
      'Lies dir alle Erläuterungen gründlich durch.',
      'Schalte Störquellen (z.B. Fernseher, Musik, Handy) für eine konzentrierte Bearbeitung aus!',
      'Lege dir Papier und Stift bereit!',
      'Es ist jederzeit möglich, das SelfAssessment zu unterbrechen und zu einem späteren Zeitpunkt fortzusetzen.'
    ];

    this.infoContent = `
      Nach dem Du das SelfAssessment gestartet hast, erhältst Du einen PIN. Mit dieser kannst Du
      Dein SelfAssessment - wenn gewünscht - zu einem späteren Zeitpunkt fortsetzen oder die
      Ergebnisse und Deine Bescheinigung abrufen. Notiere sie daher bitte für den möglichen
      späteren Gebrauch. Bitte beachte: Eine spätere Wiederherstellung des PINs ist nicht möglich.
    `;

    this.encouragement = 'Viel Spaß und viel Erfolg!';

    this.pinNote = `
      Bitte notiere deinen PIN, damit du zu einem späteren Zeitpunkt deine Teilnahmebescheinigung und/oder dein
      Feedback noch einmal aufrufen kannst.
    `;

    this.startTestLbl = 'Starte das SelfAssessment';

    this.notesLbl = 'Bearbeitungshinweise';
  }


  /**
   * Start the selfassessment by loading the specific config file for the course and
   * saving the generated journal structure in the local storage.
   */
  public startSelfAssessment(): void {
    this.configService.loadConfigFromCourse(this.course.name)
      .subscribe(
        (configFile: ConfigFile) => {
          const journal: Journal = this.configService.initJournalFromConfigFile(configFile);
          this.journalService.saveJournalStructure(journal.structure)
            .subscribe(
              () => {
                this.logging.info('Start the test procedure');
                this.router.navigateByUrl('/testpanel');
              },
              err => this.logging.error('Error occurred', err)
            );
        }
      );
  }

}
