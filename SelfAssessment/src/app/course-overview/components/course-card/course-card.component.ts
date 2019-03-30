import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Course } from 'src/app/shared/models/configuration/course.model';

/**
 * Displays a course card.
 */
@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent {

  /**
   * The course object.
   */
  @Input() course: Course;

  /**
   * The event emitted when the user chooses this course.
   */
  @Output() start = new EventEmitter<Course>();

  /** Empty constructor */
  constructor( ) { }

  /**
   * Emits the event and tells the parent component that the user choose this course.
   */
  public startTest(): void {
    this.start.emit(this.course);
  }
}
