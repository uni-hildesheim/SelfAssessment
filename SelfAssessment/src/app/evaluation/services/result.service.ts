import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { tap, map } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { RawResultTest } from 'src/app/shared/models/evaluation/raw/raw.result.test';
import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { TestSet } from 'src/app/shared/models/testspecific/testset.model';
import { ResultSet } from 'src/app/shared/models/evaluation/result.set';
import { Test } from 'src/app/shared/models/testspecific/test.model';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  public static readonly LOAD_RESULT = 'api/v1/result/load';

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }


  public getResults(): Observable<ResultSet[]> {
    const pin =  this.storage.getPin();
    return this.http.post(ResultService.LOAD_RESULT, {pin})
    .pipe(
      map((data: RawResultTest[]) => {

        const mapRawTests = new Map<any, RawResultTest>();
        const structure: JournalStructure = this.storage.getJournalStructure();
        const resultSets: ResultSet[] = [];

        data.forEach((rawResultTest: RawResultTest) => {
          mapRawTests.set(rawResultTest.id, rawResultTest);
        });

        structure.sets.forEach((set: TestSet) => {
          const resultSet = new ResultSet();
          resultSet.id = set.id;
          resultSet.tests = [];


          set.elements.forEach(element => {

            // if (element.setType === 'test' && (<Test>element).evaluated) {

            //   const options = [];


            // for (let i = 0; i < (<Test>element).options.length; i++) {

            //   if (mapRawTests.get(element.id.toString()).correctOptions.includes(i)) {
            //     options.push([true, (<Test>element).options[i].text]);

            //   } else if (mapRawTests.get(element.id.toString()).wrongOptions.includes(i)) {
            //     options.push([false, (<Test>element).options[i].text]);
            //   }

            // }

            // mapRawTests.get(element.id.toString()).options = options;


            // }


            if (mapRawTests.has(element.id.toString())) {
              resultSet.tests.push(mapRawTests.get(element.id.toString()));
            }
          });
          resultSets.push(resultSet);
        });

        return resultSets;

      }),
      tap(data => {
        this.logging.info(`Loaded evaluation for pin: ${pin}`);
        this.logging.debug(undefined, data);
      })
    );
  }

}
