import { Component, OnInit, Input } from '@angular/core';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';

/**
 * Displays an information card.
 */
@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.component.html',
  styleUrls: ['./infopage.component.scss']
})
export class InfopageComponent implements OnInit {

  /**
   * The infopage instance.
   */
  @Input() infopage: Infopage;

  constructor() { }

  ngOnInit() { }

}
