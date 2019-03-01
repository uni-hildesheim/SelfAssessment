import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfopageComponent } from './infopage.component';
import { MaterialModule } from 'src/app/material/material.module';
import { Infopage } from 'src/app/shared/models/procedure/infopage.model';

describe('InfopageComponent', () => {
  let component: InfopageComponent;
  let fixture: ComponentFixture<InfopageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfopageComponent ],
      imports: [MaterialModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfopageComponent);
    component = fixture.componentInstance;
    const infopage = new Infopage();
    infopage.id = '4000';
    infopage.text = 'text';
    component.infopage = infopage;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
