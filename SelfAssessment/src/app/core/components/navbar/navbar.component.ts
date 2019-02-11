import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { MatSelectChange } from '@angular/material';
import { ResourceService } from '../../services/resource.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';

/**
 * The top panel for the title.
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  lang: string[];

  constructor(
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private resourceService: ResourceService
  ) { }

  ngOnInit() {

    this.lang = this.storageService.getAllResources()
      .map(obj => obj.language);
  }

  langChange(matselect: MatSelectChange) {
    this.logging.info(`Change language to ${matselect.value}`);
    this.resourceService.changeLang(matselect.value);
  }


}
