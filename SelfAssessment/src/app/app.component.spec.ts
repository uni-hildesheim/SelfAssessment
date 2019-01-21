import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { EntryComponent } from './core/components/entry/entry.component';
import { MainPanelComponent } from './testpanel/components/main-panel/main-panel.component';
import { MaterialModule } from './material/material.module';
import { SingleTestCardComponent } from './testpanel/components/single-test-card/single-test-card.component';
import { TestpanelModule } from './testpanel/testpanel.module';

xdescribe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TestpanelModule,
        MaterialModule
      ],
      declarations: [
        AppComponent, EntryComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
