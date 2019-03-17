import { TestpanelModule } from './../testpanel/testpanel.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkbenchComponent } from './components/workbench/workbench.component';
import { SharedModule } from '../shared/shared.module';
import { CreateTestComponent } from './components/category/create-test/create-test.component';
import { TestBoxComponent } from './components/creation-box/test-box/test-box.component';
import { InfopageBoxComponent } from './components/creation-box/infopage-box/infopage-box.component';
import { CreateInfopageComponent } from './components/creation-box/infopage-box/create-infopage/create-infopage.component';
import { SetBoxComponent } from './components/creation-box/set-box/set-box.component';
import { TestgroupBoxComponent } from './components/creation-box/testgroup-box/testgroup-box.component';
import { ConfigBoxComponent } from './components/creation-box/config-box/config-box.component';
import { SwitchModeComponent } from './components/category/switch-mode/switch-mode.component';
import { CreateCategoryComponent } from './components/category/create-category/create-category.component';
import { ElementPickerComponent } from './components/element-picker/element-picker.component';

@NgModule({
  entryComponents: [CreateInfopageComponent, CreateCategoryComponent],
  declarations: [WorkbenchComponent, CreateTestComponent,
     TestBoxComponent, InfopageBoxComponent, CreateInfopageComponent, SetBoxComponent, TestgroupBoxComponent,
     ConfigBoxComponent, SwitchModeComponent, CreateCategoryComponent, ElementPickerComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    TestpanelModule
  ]
})
export class AdminModule { }
