import { BasicConfig } from './../../../models/basic.config.interface';
import { ConfigDataService } from './../../../services/config-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-box',
  templateUrl: './config-box.component.html',
  styleUrls: ['./config-box.component.scss', '../box-style.scss']
})
export class ConfigBoxComponent implements OnInit {

  config: BasicConfig;

  constructor(
    private configData: ConfigDataService
  ) { }

  ngOnInit() {
    this.config = this.configData.config;
  }

  addLang() {
    this.configData.addLanguage();
  }

  customTrackBy(index) {
    return index;
  }

  removeLang(id) {
    this.configData.removeLanguage(id);
  }

}
