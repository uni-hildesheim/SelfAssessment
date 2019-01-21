import { Component, OnInit, Input } from '@angular/core';
import { Infopage } from 'src/app/shared/models/testspecific/infopage.model';

@Component({
  selector: 'app-infopage',
  templateUrl: './infopage.component.html',
  styleUrls: ['./infopage.component.scss']
})
export class InfopageComponent implements OnInit {

  @Input() infopage: Infopage;


  constructor() { }

  ngOnInit() {
  }

}
