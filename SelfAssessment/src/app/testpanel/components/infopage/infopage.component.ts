import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';

/**
 * Displays an information card.
 */
@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.component.html',
  styleUrls: ['./infopage.component.scss', '../../../../scss/panel-cards.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InfopageComponent {

  /**
   * The infopage instance.
   */
  @Input() infopage: Infopage;

  /**
   * Empty constructor for infopage.
   */
  constructor() { }

}
