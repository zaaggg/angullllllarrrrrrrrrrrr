import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProtocolSelectionComponent } from './protocol-selection/protocol-selection.component';
import { ReportCreateComponent } from './report-create/report-create.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { FillReportComponent } from './fill-report/fill-report.component';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'protocol-selection', component: ProtocolSelectionComponent },
  { path: 'report-create', component: ReportCreateComponent },
  { path: 'view-reports', component: ViewReportsComponent},
  { path: 'fill-report/:reportId', component: FillReportComponent }

];
