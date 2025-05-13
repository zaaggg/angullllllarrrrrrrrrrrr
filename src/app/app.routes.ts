import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProtocolSelectionComponent } from './protocol-selection/protocol-selection.component';
import { ReportCreateComponent } from './report-create/report-create.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { FillReportComponent } from './fill-report/fill-report.component';
import { ProtocolCreateComponent } from './protocol-create/protocol-create.component';
import { Admin } from 'mongodb';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'protocol-selection', component: ProtocolSelectionComponent },
  { path: 'report-create', component: ReportCreateComponent },
  { path: 'view-reports', component: ViewReportsComponent},
  { path: 'fill-report/:reportId', component: FillReportComponent },
  { path: 'protocol-create', component: ProtocolCreateComponent },
  {path: 'update-password',component:UpdatePasswordComponent},
  {path: 'edit-profile', component:EditProfileComponent},

  {
    path: 'admin-plant',
    loadComponent: () =>
      import('./plant-admin/plant-admin.component')
        .then(m => m.PlantAdminComponent)
  },
  {
    path: 'department-management',
    loadComponent: () =>
      import('./department-management/department-management.component')
        .then(m => m.DepartmentManagementComponent)
  },
  {
    path: 'update-password',
    loadComponent: () =>
      import('./update-password/update-password.component')
        .then(m => m.UpdatePasswordComponent)
  },

  {
    path: 'notify-list',
    loadComponent: () =>
      import('./notify-list/notify-list.component')
        .then(m => m.NotifyListComponent)
  },
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./edit-profile/edit-profile.component')
        .then(m => m.EditProfileComponent)
  }



];
