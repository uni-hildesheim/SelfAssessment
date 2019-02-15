
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './course-overview/components/dashboard/dashboard.component';
import { StartTestComponent } from './course-overview/components/start-test/start-test.component';
import { MainPanelComponent } from './testpanel/components/main-panel/main-panel.component';
import { StartTestGuard } from './core/guards/start-test.guard';
import { TestpanelGuard } from './core/guards/testpanel.guard';
import { EvaluationOverviewComponent } from './evaluation/components/evaluation-overview/evaluation-overview.component';
import { ValidationComponent } from './evaluation/components/validation/validation.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'test-start', component: StartTestComponent, canActivate: [StartTestGuard] },
  { path: 'testpanel', component: MainPanelComponent, canActivate: [TestpanelGuard] },
  { path: 'evaluation', component: EvaluationOverviewComponent},
  { path: 'validation', component: ValidationComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: DashboardComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
