import { LoggingService } from 'src/app/shared/logging/logging.service';
import { JournalStructure } from './../../../shared/models/state/journal.structure.model';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Observable, of } from 'rxjs';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { tap, catchError } from 'rxjs/operators';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { Test } from 'src/app/shared/models/procedure/test.model';
import { ResultTest } from 'src/app/shared/models/evaluation/result.test';

/**
 * Component that displays the evaluation of the users test procedure.
 */
@Component({
  selector: 'app-evaluation-overview',
  templateUrl: './evaluation-overview.component.html',
  styleUrls: ['./evaluation-overview.component.scss']
})
export class EvaluationOverviewComponent implements OnInit {

  /**
   * Observable containing the result set array.
   */
  public results$: Observable<ResultSet[]>;

  /**
   * Boolean that specifies if the evaluation set is being loaded.
   */
  public loading = false;

  /**
   * The user specific journal structure.
   */
  public journalStructure: JournalStructure;

  /**
   * The course which the user choose.
   */
  public course: string;

  /**
   * All the different types.
   */
  public types: string[];

  /**
   * If the user choose to filter by type, this variable contains the selected type.
   */
  public currentType: string;

  /**
   * If the user choose to filter by type, this variable contains all the tests of a specific type.
   */
  public testsByType: ResultTest[][];

  constructor(
    private resultService: ResultService,
    private router: Router,
    public route: ActivatedRoute,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  /**
   * Check if it is necessary to show the info card before retrieving the evaluation.
   */
  ngOnInit() {
    this.journalStructure = this.storage.retrieveFromStorage(StorageItem.JOURNAL_STRUCTURE);
    if (!this.route.snapshot.paramMap.get('show')) {
      // user does not need to see the info card
      this.course = this.storage.retrieveFromStorage(StorageItem.COURSE).name;
    } else {
      if (this.resultService.evaluation != null) {
        // user provided pin
        this.results$ = this.resultService.evaluation;
      } else {
        // user did not provide pin
        this.showEval();
      }
    }

  }

  /**
   * Retrieves the score dependent texts for a specific set.
   *
   * @param index The index of the set.
   * @returns All the set-specific score dependent texts.
   */
  public getScoreDependentText(index: number): [number, string][]  {
    return this.journalStructure.sets[index].scoreDependentTexts;
  }

  /**
   * Retrieves the score independent text for a specific text.
   *
   * @param index The index of the set.
   * @returns The score independent text for a set.
   */
  public getScoreIndependentTexts(index: number): string {
    return this.journalStructure.sets[index].scoreIndepentText;
  }

  /**
   * Retrieves all the types in every test of every set.
   *
   * @returns Array containing all possible types.
   */
  public getAllTypes(): string[] {

    const types = [];

    this.journalStructure.sets
    .map(set => {
      set.elements
      .filter(e => e.elementType.valueOf() === SetElementType.TEST && (<Test>e).evaluated)
      .map(e => {
        if (!types.find(t => t === (<Test>e).type)) {
          types.push((<Test>e).type);
        }
      });
    });

    return types;
  }

  /**
   * Filters all the tests in the result set by type and only appends those whose type match to the
   * testByType array.
   *
   * @param type The choosen type.
   * @param sets The current result set.
   */
  public filterByType(type: string, sets: ResultSet[]): void {
    this.currentType = type;
    this.testsByType = [];
    sets.map(s => {
      s.tests.map(t => {
        if (t.singleTest.type === this.currentType) {
          this.testsByType.push([t]);
        }
      });
    });
  }

  /**
   * Gets the observable containing the users evaluation.
   */
  public showEval(): void {
    this.types = this.getAllTypes();
    this.loading = true;
    const pin = this.storage.retrieveFromStorage(StorageItem.PIN);
    this.results$ = this.resultService.getResults(pin)
    .pipe(
      tap(() => this.loading = false),
      catchError(error => {
        this.loading = false;
        this.logging.error('Error loading the evaluation set', error);
        return of([]);
       })
      );
  }

  /**
   * Navigates to the validation page.
   */
  public goToValidation(): void {
    this.router.navigateByUrl('/validation');
  }

}
