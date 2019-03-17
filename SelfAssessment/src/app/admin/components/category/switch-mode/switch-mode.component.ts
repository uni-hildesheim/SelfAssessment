import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Language } from 'src/app/admin/models/language.model';
import { ConfigDataService } from 'src/app/admin/services/config-data.service';

@Component({
  selector: 'app-switch-mode',
  templateUrl: './switch-mode.component.html',
  styleUrls: ['./switch-mode.component.scss']
})
export class SwitchModeComponent implements OnInit {

  @Output() buildOut = new EventEmitter<boolean>();
  @Output() endOut = new EventEmitter<boolean>();
  @Output() langChangeOut = new EventEmitter<Language>();
  build = false;
  languages: Language[];
  currentLanguage: Language;

  constructor(
    private configData: ConfigDataService
  ) { }

  ngOnInit() {
    this.languages = this.configData.config.languages;
    this.currentLanguage = this.languages[0];
  }

  changeMode() {
    this.build = !this.build;
    this.buildOut.emit(this.build);
  }

  endBuild() {
    this.endOut.emit(true);
  }

  langChange(lang:Language){
    this.langChangeOut.emit(lang);
  }

}
