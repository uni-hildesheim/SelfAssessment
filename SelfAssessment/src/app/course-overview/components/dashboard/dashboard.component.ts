import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/shared/services/config.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigFile } from 'src/app/shared/models/config.file.model';
import { RouterModule, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  courses: ConfigFile[];

  constructor(
    private configService: ConfigService,
    private router: Router,
    private storageService: LocalStorageService
    ) { }

  ngOnInit() {
    this.configService.extractCourseConfigFileNames().subscribe(
      data => {
        data.subscribe(test => this.courses = test);
      }
    );
  }

  startTheTest(course) {
    this.storageService.storeConfigFile(course);
    this.router.navigateByUrl('/test-start');
  }


}
