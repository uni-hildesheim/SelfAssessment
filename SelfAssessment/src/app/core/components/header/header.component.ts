import { StorageItem } from './../../../shared/services/local.storage.values.enum';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { ResourceService } from '../../services/resource.service';

/**
 * Header component which displays the application logo, the title and provides the functionality
 * to change the language setting for the overall static content (NOT the course language).
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * Array containing the languages which are supported.
   */
  lang: string[];

  /**
   * Constructor for the header component.
   */
  constructor(
    private storageService: LocalStorageService,
    private logging: LoggingService,
    private resourceService: ResourceService
  ) { }

  /**
   * Get the resource object from the local storage and extract the languages.
   */
  ngOnInit() {
    this.lang = this.storageService
    .retrieveFromStorage(StorageItem.RESOURCES)
    .map(obj => obj.language);
  }

  /**
   * Changes the language.
   * @param value The choosen language from the select box.
   */
  langChange(value: string) {
    this.logging.info(`Change language to ${value}`);
    this.resourceService.changeLang(value);
  }

}
