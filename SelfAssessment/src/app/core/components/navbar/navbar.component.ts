import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MatSelectChange } from '@angular/material';

/**
 * The top panel for the title.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  lang = ['de', 'en', 'fr'];

  constructor(
    private storageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.storageService.storeLanguage(this.lang[0]);
  }

  langChange(matselect: MatSelectChange) {
    this.storageService.storeLanguage(matselect.value);
  }


}
