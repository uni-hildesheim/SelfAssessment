import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { CodeService } from '../../../shared/services/code.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  validation: Observable<string>;

  constructor(
    private pinService: CodeService,
    private storageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  createValidationCode() {
    this.validation = this.pinService.createNewValidationCode(this.storageService.retrieveFromStorage(StorageItem.PIN));
  }

  backToEval() {
    this.router.navigate(['/evaluation', {show: false }]);
  }

}
