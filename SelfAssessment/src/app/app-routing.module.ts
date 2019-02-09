
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './course-overview/components/dashboard/dashboard.component';
import { StartTestComponent } from './course-overview/components/start-test/start-test.component';
import { MainPanelComponent } from './testpanel/components/main-panel/main-panel.component';
import { StartTestGuard } from './core/guards/start-test.guard';
import { TestpanelGuard } from './core/guards/testpanel.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'test-start', component: StartTestComponent, canActivate: [StartTestGuard] },
  { path: 'testpanel', component: MainPanelComponent, canActivate: [TestpanelGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
