import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Course } from 'src/app/shared/models/course-object';

/**
 * Displays a course.
 */
@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {

  /**
   * The course object.
   */
  @Input() course: Course;

  /**
   * The event emitted when the user chooses this course.
   */
  @Output() start = new EventEmitter<Course>();

  constructor() { }

  ngOnInit() {
  }

  /**
   * Emits the event and tells the parent component that the user choose this course.
   */
  public startTest(): void {
    this.start.emit(this.course);
  }
}
