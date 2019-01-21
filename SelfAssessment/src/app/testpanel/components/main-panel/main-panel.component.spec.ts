import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPanelComponent } from './main-panel.component';
import { JournalService } from 'src/app/shared/services/journal.service';
import { MaterialModule } from 'src/app/material/material.module';
import { SingleTestCardComponent } from '../single-test-card/single-test-card.component';
import { GlobalIndicator } from '../../global.indicators';
import { InfopageComponent } from '../infopage/infopage.component';
import { HttpClientModule } from '@angular/common/http';

xdescribe('MainPanelComponent', () => {
  let component: MainPanelComponent;
  let fixture: ComponentFixture<MainPanelComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MainPanelComponent, SingleTestCardComponent, InfopageComponent],
      providers: [GlobalIndicator, JournalService],
      imports: [MaterialModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MainPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));


  it('should disable buttons', async(() => {
    fixture.detectChanges();

    const btnbackward = fixture.nativeElement.querySelectorAll('button')[0];
    const btnforward = fixture.nativeElement.querySelectorAll('button')[1];

    component.setIndex = component.journalStructure.sets.length - 1;
    component.setElemIndex = component.journalStructure.sets[component.journalStructure.sets.length - 1].elements.length - 1;

    fixture.detectChanges();

    expect(btnforward.disabled).toBeTruthy();

    component.setIndex = 0;
    component.setElemIndex = 0;

    fixture.detectChanges();

    expect(btnbackward.disabled).toBeTruthy();

  }));

  it('should jump sets', async(() => {
    fixture.detectChanges();

    const btnbackward = fixture.nativeElement.querySelectorAll('button')[0];
    const btnforward = fixture.nativeElement.querySelectorAll('button')[1];

    component.setIndex = 1;
    component.setElemIndex = 0;

    fixture.detectChanges();
    btnbackward.click();
    fixture.detectChanges();

    expect(component.setIndex).toBe(0);
    expect(component.setElemIndex).toBe(component.journalStructure.sets[component.setIndex].elements.length - 1);

    btnforward.click();
    fixture.detectChanges();

    expect(component.setIndex).toBe(1);
    expect(component.setElemIndex).toBe(0);

  }));
});
