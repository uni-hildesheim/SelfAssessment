import { LanguageSpecificInfoText } from './../../../../models/language.specific.infopage.text';
import { Language } from './../../../../models/language.model';
import { InfopageBlock } from './../../../../models/infopage.block.model';
import { ConfigDataService } from 'src/app/admin/services/config-data.service';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-infopage',
  templateUrl: './create-infopage.component.html',
  styleUrls: ['./create-infopage.component.scss']
})
export class CreateInfopageComponent implements OnInit {

  infopage: InfopageBlock;
  currentText: LanguageSpecificInfoText;
  languages: Language[];
  currentLanguage: Language;
  build = false;

  constructor(
    public dialogRef: MatDialogRef<CreateInfopageComponent>,
    public configData: ConfigDataService,
    @Inject(MAT_DIALOG_DATA) public data: InfopageBlock
  ) { }

  ngOnInit() {
    this.infopage = this.data;
    this.languages = this.configData.config.languages;
    this.currentLanguage = this.languages[0];
    this.currentText = this.infopage.text.find(o => o.language.id === this.currentLanguage.id);

  }

  getCurrentLangInfopage() {
    const infopage = new Infopage();
    infopage.id = this.infopage.id;
    infopage.belongs = this.infopage.belongs;
    infopage.text = this.infopage.text.find(o => o.language.id === this.currentLanguage.id).text;
    return infopage;
  }

  addElementToInfopage(element) {
    this.infopage.belongs.push(element);
  }

  getPossibleElements() {
    return this.configData.testgroups.getValue().concat(this.configData.tests.getValue());

  }

  removeElement(id) {
    this.infopage.belongs = this.infopage.belongs.filter(e => e.id !== id);
  }


  tabLangChanged(index) {
    this.currentLanguage = this.languages[index];
    this.currentText = this.infopage.text.find(o => o.language.id === this.currentLanguage.id);
  }

  changeMode(val) {
    this.build = val;
  }

  end(val) {
    this.dialogRef.close(this.infopage);
  }


  addId() {
    this.infopage.belongs.push('');
  }
  deleteId(id) {
    this.infopage.belongs = this.infopage.belongs.filter(o => o !== id);
  }

  getCurrentTextObj(lang: Language) {
    return this.infopage.text.find(o => o.language.id === lang.id);
  }


  customTrackBy(index) {
    return index;
  }

}
