import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntryComponent } from './entry.component';
import { TestpanelModule } from 'src/app/testpanel/testpanel.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/material/material.module';

xdescribe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryComponent ],
      imports: [TestpanelModule, HttpClientModule, RouterTestingModule, MaterialModule]
     })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
