import { tap } from 'rxjs/operators';
import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { CodeService } from '../../../shared/services/code.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

/**
 * Component which displays some text and fetches the validation code for the user.
 */
@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  /**
   * The validation code observable.
   */
  validation: Observable<string>;

  /**
   * Whether the code request is still loading.
   */
  validationLoading = false;

  /**
   * Constructor for this component.
   */
  constructor(
    private codeService: CodeService,
    private storageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * Requests the validation code from the code service.
   */
  createValidationCode() {
    this.validationLoading = true;
    this.validation = this.codeService
    .createNewValidationCode(this.storageService.retrieveFromStorage(StorageItem.PIN))
    .pipe(
      tap(() => {
        this.validationLoading = false;
      })
    );
  }

  /**
   * Navigates back to the evaluation page.
   */
  backToEval() {
    this.router.navigate(['/evaluation', {show: false }]);
  }

}
