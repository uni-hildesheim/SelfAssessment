import { Test } from 'src/app/shared/models/procedure/test.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ConfigDataService } from 'src/app/admin/services/config-data.service';
import { Language } from 'src/app/admin/models/language.model';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { TestBlock } from 'src/app/admin/models/test.block.model';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  test: TestBlock;
  model: any[] = [];
  languages: Language[];
  currentLanguage: Language;
  build = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    public configData: ConfigDataService,
    @Inject(MAT_DIALOG_DATA) public data: TestBlock
  ) { }

  ngOnInit() {
    this.languages = this.configData.config.languages;
    this.currentLanguage = this.languages[0];
    this.test = this.data;
    this.createFakeModel();
 }

  langChange(lang){
    this.currentLanguage = lang;
  }


  changeMode(val) {
    this.build = val;
    if (!this.build) {
      this.createFakeModel();
    }
  }

  end(val) {
    this.dialogRef.close(this.test);
  }

  createFakeModel() {
    return this.model = this.configData.createFakeModel(this.test, this.currentLanguage);
  }

  getCurrentLangTest(): Test {
    return this.configData.getCurrentLangTest(this.currentLanguage, this.test);
  }


}
