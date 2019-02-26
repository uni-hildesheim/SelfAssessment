import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { Pipe, PipeTransform } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ResourceService } from '../../services/resource.service';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';
import { Resource } from 'src/app/shared/models/resources/resources.model';



const strings = {
  'language': 'English'
};



const resourceDummy: Resource = {
  header: 'myheader',
  footer: '',
  language: 'English',
  name: '',
  strings: strings,
  vendor: {
    logo: 'mylogo.jpg',
    name: ''
  }
};

const resourceDummy2: Resource = {
  header: '',
  footer: '',
  language: 'Deutsch',
  name: '',
  strings: {},
  vendor: {
    logo: '',
    name: ''
  }
};


@Pipe({name: 'resources'})
class MockResourcePipe implements PipeTransform {
    transform(value: string, args?: any): string {
      if (args) {
        return resourceDummy[value][args];
      } else {
        return resourceDummy[value];
      }
    }
}

@Pipe({name: 'language'})
class MockLangPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let resourceService: ResourceService;


  beforeEach(async(() => {


    const storageStub = {
      retrieveFromStorage(item: StorageItem): Resource[] {
        return [resourceDummy, resourceDummy2];
      }
    };


    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, MockResourcePipe, MockLangPipe ],
      imports: [MaterialModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        {provide: LocalStorageService, useValue: storageStub}
        , ResourceService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    resourceService = TestBed.get(ResourceService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pipe the correct resources and language refs', () => {
    expect(fixture.nativeElement.querySelector('img').src).toContain('mylogo.jpg');
    expect(fixture.nativeElement.querySelector('.header').innerText).toContain('myheader');
  });

  it('should change the language', () => {
    spyOn(resourceService, 'changeLang');
    component.langChange('Deutsch');
    expect(resourceService.changeLang).toHaveBeenCalledWith('Deutsch');
  });

});
