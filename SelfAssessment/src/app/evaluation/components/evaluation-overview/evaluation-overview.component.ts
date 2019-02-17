import { LoggingService } from 'src/app/shared/logging/logging.service';
import { JournalStructure } from './../../../shared/models/state/journal.structure.model';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Observable, of } from 'rxjs';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { tap, catchError } from 'rxjs/operators';

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

  constructor(
    private resultService: ResultService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  ngOnInit() {
    this.journalStructure = this.storage.getJournalStructure();
    if (!this.route.snapshot.paramMap.get('show')) {
      // user does not need to see the info card
      this.course = this.storage.getCourse().name;
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

  showEval() {
    this.loading = true;
    const pin = this.storage.getPin();
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
