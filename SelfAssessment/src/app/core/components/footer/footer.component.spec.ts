import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { Resource } from 'src/app/shared/models/resources/resources.model';
import { Pipe, PipeTransform } from '@angular/core';

const resourceDummy: Resource = {
  header: '',
  footer: 'myfooter',
  language: '',
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

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterComponent, MockResourcePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show correct resource footer text', () => {
    expect(fixture.nativeElement.querySelector('span').innerText).toContain('myfooter');
  });
});
