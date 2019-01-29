import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { ConfigFile } from 'src/app/shared/models/config.file.model';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  courses: Observable<Object>;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private storageService: LocalStorageService
  ) { }

  ngOnInit() {
    this.courses = this.configService.getAllCourses();
  }

  startTheTest(course) {
    this.configService.loadConfigFromCourse(course).subscribe(
      (config: ConfigFile) => {
        this.storageService.storeConfigFile(config);
      }
    );
    this.router.navigateByUrl('/test-start');
  }
}
