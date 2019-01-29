import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from 'src/app/shared/models/course-object';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  @Input() course: Course;
  @Output() start = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  startTest() {
    this.start.emit(this.course.name);
  }
}
