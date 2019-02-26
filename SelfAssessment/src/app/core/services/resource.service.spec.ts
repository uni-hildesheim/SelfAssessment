import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Resource } from 'src/app/shared/models/resources/resources.model';



describe('ResourceService', () => {

  let service: ResourceService;
  let httpTestingController: HttpTestingController;


  const resourcesDummy: Resource[] = [
    {
      header: 'myheader',
      footer: '',
      language: 'English',
      name: '',
      strings: {},
      vendor: {
        logo: 'mylogo.jpg',
        name: ''
      }
    },
    {
      header: '',
      footer: '',
      language: 'Deutsch',
      name: '',
      strings: {},
      vendor: {
        logo: '',
        name: ''
      }
    }
  ];



  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.get(ResourceService);
    httpTestingController = TestBed.get(HttpTestingController);

    const store = {};

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should load Resources from api endpoint', () => {

    spyOn(service, 'getResources').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve(resourcesDummy[0]);
      });
    });
    service.loadResources()
    .then(() => {
      expect(service.getResources).toHaveBeenCalled();
    });

    const mockReq = httpTestingController.expectOne(ResourceService.LOAD_RESOURCES);

    expect(mockReq.request.url).toEqual(ResourceService.LOAD_RESOURCES);
    mockReq.flush(resourcesDummy);

  });


  it('should load Resource for specific language on lang change (not already stored)', () => {

    // case 1: resources are already in local storage
    localStorage.setItem('resources', JSON.stringify(resourcesDummy));
    spyOn(service, 'loadResources');
    service.changeLang('Deutsch').then(() => {
      expect(service.loadResources).not.toHaveBeenCalled();
    });

  });


  it('should load Resource for specific language on lang change (already stored)', () => {

    // case 2: resources are not in local storage and must be loaded (mock that)
    spyOn(service, 'loadResources').and.callFake(() => {
      return new Promise((resolve, reject) => {
        resolve(resourcesDummy);
      });
    });
    service.changeLang('Deutsch').then(() => {
      expect(service.loadResources).toHaveBeenCalled();
    });

  });

});
