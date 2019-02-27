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

@Component({
  selector: 'app-evaluation-overview',
  templateUrl: './evaluation-overview.component.html',
  styleUrls: ['./evaluation-overview.component.scss']
})
export class EvaluationOverviewComponent implements OnInit {

  public results$: Observable<ResultSet[]>;
  public loading = false;
  public journalStructure: JournalStructure;
  public course: string;
  public types: string[];
  public currentType: string;
  public testsByType: ResultTest[][];

  constructor(
    private resultService: ResultService,
    private router: Router,
    public route: ActivatedRoute,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

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

  getScoreDependentText(index: number): [number, string][]  {
    return this.journalStructure.sets[index].scoreDependentTexts;
  }

  getScoreIndependentTexts(index: number): string {
    return this.journalStructure.sets[index].scoreIndepentText;
  }

  getAllTypes(): string[] {

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


  filterByType(type: string, sets: ResultSet[]) {
    this.currentType = type;
    this.testsByType = [];
    sets.map(s => {
      s.tests.map(t => {
        if (t.singleTest.type === this.currentType) {
          this.testsByType.push([t]);
        }
      });
    });
    console.log(this.testsByType);
  }

  showEval() {
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


  goToValidation() {
    this.router.navigateByUrl('/validation');
  }

}
