import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigFile } from 'src/app/shared/models/config.file.model';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: ConfigFile;
  @Output() start = new EventEmitter<ConfigFile>();


  constructor() { }

  ngOnInit() {
  }

  startTest() {
    this.start.emit(this.course);
  }

}
