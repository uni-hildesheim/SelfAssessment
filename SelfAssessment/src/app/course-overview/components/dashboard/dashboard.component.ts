import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ConfigFile } from 'src/app/shared/models/config.file.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public courses: Observable<Object>;
  private ngUnsubscribe = new Subject();

  constructor(
    private configService: ConfigService,
    private router: Router,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.courses = this.configService.getAllCourses();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  startTheTest(course) {
    this.storageService.storeCourse(course);
    this.router.navigate(['/test-start', course]);

    // this.configService.loadConfigFromCourse(course)
    // .pipe(takeUntil(this.ngUnsubscribe))
    // .subscribe(
    //   (config: ConfigFile) => {
    //     // this.storageService.storeConfigFile(config);
    //     this.router.navigate(['/test-start', {icon: config.icon}]);
    //   }
    // );
  }
}
