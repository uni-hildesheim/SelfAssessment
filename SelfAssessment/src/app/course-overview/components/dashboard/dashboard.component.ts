import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Observable } from 'rxjs';
import { Resource } from 'src/app/shared/models/resources/resources.model';
import { ResourceService } from 'src/app/core/services/resource.service';

/**
 * Realizes the Dashboard which displays all the courses.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /**
   * Observable containing the courses.
   */
  public courses: Observable<Object>;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private storageService: LocalStorageService
  ) { }

  /**
   * Get all the courses from the config service.
   */
  ngOnInit() {
    this.courses = this.configService.getAllCourses();
  }

  /**
   * Navigate to the start-test page if the user choose a course.
   * @param course The course.
   */
  public startTheTest(course): void {
    this.storageService.storeCourse(course);
    this.router.navigate(['/test-start', course]);
  }
}
