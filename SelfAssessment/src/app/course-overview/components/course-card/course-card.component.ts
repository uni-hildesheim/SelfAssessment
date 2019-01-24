import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: string;
  @Output() start = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  startTest() {
    this.start.emit(this.course);
  }

}
