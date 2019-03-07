import { Course } from '../../../shared/models/configuration/course.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCardComponent } from './course-card.component';
import { MaterialModule } from 'src/app/material/material.module';
import { Pipe, PipeTransform } from '@angular/core';

const strings = {
  'btn-start': 'Start'
};

@Pipe({name: 'language'})
class MockPipe implements PipeTransform {
    transform(value: string): string {
        return strings[value];
    }
}

describe('CourseCardComponent', () => {
  let component: CourseCardComponent;
  let fixture: ComponentFixture<CourseCardComponent>;
  let buttonElement: HTMLElement;

  const mockCourse: Course = {
    name: 'IMIT',
    icon: 'imit.jpg',
    languages: ['English']
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule],
      declarations: [ CourseCardComponent, MockPipe]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseCardComponent);
    component = fixture.componentInstance;
    component.course = mockCourse;
    buttonElement = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display elements correctly', () => {
    expect( fixture.nativeElement.querySelector('p').innerHTML).toEqual(mockCourse.name);
    expect( fixture.nativeElement.querySelector('img').src).toContain(mockCourse.icon);
    expect(buttonElement.innerText).toEqual('Start');
  });

  it('should emit course on click', () => {
    spyOn(component.start, 'emit');
    buttonElement.click();
    fixture.detectChanges();
    expect(component.start.emit).toHaveBeenCalled();
    expect(component.start.emit).toHaveBeenCalledWith(mockCourse);
  });



});
