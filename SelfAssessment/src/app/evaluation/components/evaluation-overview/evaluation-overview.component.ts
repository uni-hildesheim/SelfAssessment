import { LoggingService } from 'src/app/shared/logging/logging.service';
import { JournalStructure } from './../../../shared/models/state/journal.structure.model';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Router } from '@angular/router';
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

  public results: Observable<ResultSet[]>;
  public loading = false;
  public journalStructure: JournalStructure;
  public course: string;

  constructor(
    private resultService: ResultService,
    private router: Router,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  ngOnInit() {
    this.course = this.storage.getCourse().name;
    this.journalStructure = this.storage.getJournalStructure();
  }

  getScoreDependentText(index: number): [number, string][]  {
    return this.journalStructure.sets[index].scoreDependentTexts;
  }

  getScoreIndependentTexts(index: number): string {
    return this.journalStructure.sets[index].scoreIndepentText;
  }

  showEval() {
    this.loading = true;
    this.results = this.resultService.getResults()
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
