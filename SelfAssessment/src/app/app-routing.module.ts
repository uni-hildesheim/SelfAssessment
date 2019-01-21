import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './course-overview/components/dashboard/dashboard.component';
import { StartTestComponent } from './course-overview/components/start-test/start-test.component';
import { MainPanelComponent } from './testpanel/components/main-panel/main-panel.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'test-start', component: StartTestComponent },
  { path: 'testpanel', component: MainPanelComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
