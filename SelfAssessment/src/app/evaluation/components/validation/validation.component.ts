import { LocalStorageService } from './../../../shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { PinService } from './../../../shared/services/pin.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  validation: Observable<string>;

  constructor(
    private pinService: PinService,
    private storageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit() { }

  createValidationCode() {
    this.validation = this.pinService.createNewValidationCode(this.storageService.getPin());
  }

  backToEval() {
    this.router.navigateByUrl('/evaluation');
  }

}
