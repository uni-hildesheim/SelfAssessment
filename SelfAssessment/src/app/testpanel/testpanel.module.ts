import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestpanelRoutingModule } from './testpanel-routing.module';
import { MainPanelComponent } from './components/main-panel/main-panel.component';
import { SingleTestCardComponent } from './components/single-test-card/single-test-card.component';
import { MaterialModule } from '../material/material.module';
import { GlobalIndicator } from './global.indicators';
import { InfopageComponent } from './components/infopage/infopage.component';
import { SharedModule } from '../shared/shared.module';
import { SpeedTestCardComponent } from './components/speed-test-card/speed-test-card.component';

@NgModule({
  declarations: [MainPanelComponent, SingleTestCardComponent, InfopageComponent, SpeedTestCardComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TestpanelRoutingModule,
    SharedModule
  ],
  providers: [
    GlobalIndicator
  ],
  exports: [
    MainPanelComponent
  ]
})
export class TestpanelModule { }
