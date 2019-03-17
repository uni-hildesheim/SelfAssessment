import { Language } from 'src/app/admin/models/language.model';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';
import { Component, OnInit } from '@angular/core';
import { MaterialOverlayService } from 'src/app/shared/services/helper/material-overlay.service';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { ConfigDataService } from 'src/app/admin/services/config-data.service';
import { InfopageBlock } from 'src/app/admin/models/infopage.block.model';
import { LanguageSpecificInfoText } from 'src/app/admin/models/language.specific.infopage.text';

@Component({
  selector: 'app-infopage-box',
  templateUrl: './infopage-box.component.html',
  styleUrls: ['./infopage-box.component.scss', '../box-style.scss']
})
export class InfopageBoxComponent implements OnInit {

  infopages: InfopageBlock[] = [];
  languages: Language[];



  constructor(
    private overlay: MaterialOverlayService,
    private configData: ConfigDataService
  ) { }

  ngOnInit() {
    this.infopages = this.configData.infopages.getValue();
    this.languages = this.configData.config.languages;
  }


  deleteInfopage(id) {
    this.infopages = this.infopages.filter(t => t.id !== id);
    this.configData.refreshInfopage();
  }


  buildInfopage(val) {
    this.overlay.openBuildInfopageDialog(val)
      .subscribe(data => {
        val = data;
        this.configData.refreshInfopage();
      });
  }

  addInfopage() {

    const id = this.configData.createUniqueKey(this.infopages, 'infopage');

    const page: InfopageBlock = {
      elementType: SetElementType.INFOPAGE,
      id,
      belongs: [],
      text: []
    };

    for (const lang of this.languages) {

      const specificText: LanguageSpecificInfoText = {
        language: lang,
        text: ''
      };


      page.text.push(specificText);

    }

    this.infopages.push(page);
    this.configData.refreshInfopage();

  }

}
