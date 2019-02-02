import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from './config.service';
import { GlobalIndicator } from 'src/app/testpanel/global.indicators';
import { Course } from '../models/course-object';
import { ConfigFile } from '../models/config.file.model';
import { HttpResponse } from '@angular/common/http';

describe('TestDefinitionService', () => {
  let configService: ConfigService;
  let httpTestingController: HttpTestingController;

  const dummyCourses: Course[] = [
    { name: 'IMIT', icon: 'imit.jpg' },
    { name: 'WINF' }
  ];

  const dummyConfigFile: ConfigFile = {
    title: 'IMIT',
    icon: 'imit.jpg',
    checksumRegex: '',
    tests: [''],
    testgroups: [],
    infopages: [],
    sets: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [GlobalIndicator, ConfigService]
    }).compileComponents();

    configService = TestBed.get(ConfigService);
    httpTestingController = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get courses from api endpoint', () => {

    configService.getAllCourses()
      .subscribe(data => {
        expect(data).toEqual(dummyCourses);
        expect(data.length).toEqual(2);
      });

    const mockReq = httpTestingController.expectOne(ConfigService.SHOW_COURSES);

    expect(mockReq.request.method).toEqual('GET');
    expect(mockReq.request.responseType).toEqual('json');

    mockReq.flush(dummyCourses);
  });

  it('should throw error', () => {

    const emsg = 'dummy 404 error';

    configService.getAllCourses()
      .subscribe(
        data => fail('should have failed with 404 error'),
        error => {
          expect(error.status).toEqual(404, 'status');
          expect(error.error).toEqual(emsg, 'message');
        }
      );

    const mockReq = httpTestingController.expectOne(ConfigService.SHOW_COURSES);

    mockReq.flush(emsg, { status: 404, statusText: 'Not Found' });
  });



  it('should load course config from api endpoint', () => {

    configService.loadConfigFromCourse(dummyCourses[0].name)
      .subscribe(data => {
        expect(data).toEqual(dummyConfigFile);
      });

    const mockReq = httpTestingController.expectOne(ConfigService.LOAD_CONFIG);

    expect(mockReq.request.method).toEqual('POST');
    expect(mockReq.request.body).toEqual({name: dummyCourses[0].name});

    mockReq.flush(dummyConfigFile);

  });

});
