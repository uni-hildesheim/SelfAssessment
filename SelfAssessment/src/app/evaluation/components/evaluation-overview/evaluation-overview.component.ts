import { Component, OnInit } from '@angular/core';
import { ResultService } from '../../services/result.service';
import { Observable } from 'rxjs';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';

@Component({
  selector: 'app-evaluation-overview',
  templateUrl: './evaluation-overview.component.html',
  styleUrls: ['./evaluation-overview.component.scss']
})
export class EvaluationOverviewComponent implements OnInit {

  public results: Observable<ResultSet[]>;

  constructor(
    private resultService: ResultService
  ) { }

  ngOnInit() {
    this.results = this.resultService.getResults();
  }

}
