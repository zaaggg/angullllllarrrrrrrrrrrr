import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../services/report.service';
import { ReportDTO } from '../model/reportDTO.model';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-view-reports',
  imports: [CommonModule, RouterModule],
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {
  createdReports: ReportDTO[] = [];
  assignedReports: ReportDTO[] = [];
  userRole: string = '';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userRole = payload.role;

      // ✅ Fetch only created reports if user is a DEPARTMENT_MANAGER
      if (this.userRole === 'DEPARTMENT_MANAGER') {
        this.fetchCreatedReports();
      }

      // ✅ Always fetch assigned reports
      this.fetchAssignedReports();
    }
  }

  fetchCreatedReports(): void {
    this.reportService.getReportsCreatedByMe().subscribe({
      next: (reports: ReportDTO[]) => {
        this.createdReports = reports;
        console.log(this.createdReports)
      },
      error: (err) => {
        console.error('Error fetching created reports:', err);
      }
    });
  }

  fetchAssignedReports(): void {
    this.reportService.getReportsAssignedToMe().subscribe({
      next: (reports: ReportDTO[]) => {
        this.assignedReports = reports;
        console.log(this.assignedReports)
      },
      error: (err) => {
        console.error('Error fetching assigned reports:', err);
      }
    });
  }
}
