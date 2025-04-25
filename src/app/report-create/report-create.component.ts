import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssignedUserDTO } from '../model/assignedUserDTO.model';

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['./report-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReportCreateComponent implements OnInit {
  reportForm!: FormGroup;
  requiredUsers: AssignedUserDTO[] = [];
  departments: any[] = [];
  protocolId!: number;
  usersByDepartment: { [key: number]: AssignedUserDTO[] } = {};

  constructor(
    private fb: FormBuilder,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Step 1: Initialize the static part of the form first
    this.reportForm = this.fb.group({
      type: [''],
      serialNumber: [''],
      equipmentDescription: [''],
      designation: [''],
      manufacturer: [''],
      immobilization: [''],
      serviceSeg: [''],
      businessUnit: ['']
    });

    // Step 2: Get protocolId from query param and fetch users
    this.route.queryParamMap.subscribe(params => {
      const protocolIdParam = params.get('protocolId');
      if (protocolIdParam) {
        this.protocolId = Number(protocolIdParam);
        console.log('✅ Protocol ID from route:', this.protocolId);

        this.reportService.getRequiredUsers(this.protocolId).subscribe({
          next: (users) => {
            console.log('[REQUIRED USERS]', users);
            this.requiredUsers = users;

            // Group users by department
            this.usersByDepartment = {};
            users.forEach(user => {
              const deptId = user.department.id;
              if (!this.usersByDepartment[deptId]) {
                this.usersByDepartment[deptId] = [];
              }
              this.usersByDepartment[deptId].push(user);
            });

            // Extract unique departments and create FormControls
            this.departments = Object.keys(this.usersByDepartment).map(id => {
              const deptUsers = this.usersByDepartment[+id];
              return {
                id: +id,
                name: deptUsers?.[0]?.department?.name || 'Département'
              };
            });

            // Dynamically add FormControls for each department
            this.departments.forEach(dept => {
              const controlName = `department_${dept.id}`;
              if (!this.reportForm.contains(controlName)) {
                this.reportForm.addControl(controlName, new FormControl(''));
              }
            });
          },
          error: (err) => {
            console.error('[REQUIRED USERS ERROR]', err);
          }
        });
      } else {
        console.warn('❌ No protocolId found in query params');
      }
    });
  }


  groupUsersByDepartment(users: AssignedUserDTO[]): void {
    this.usersByDepartment = {};
    for (const user of users) {
      const deptId = user.department.id;
      if (!this.usersByDepartment[deptId]) {
        this.usersByDepartment[deptId] = [];
      }
      this.usersByDepartment[deptId].push(user);
    }
  }

  submitReport() {
    const formValues = this.reportForm.value;

    const assignedUsers = this.departments.map(dept => ({
      departmentId: dept.id,
      userId: formValues[`department_${dept.id}`]
    }));

    const payload = {
      ...formValues,
      protocolId: this.protocolId,
      assignedUsers
    };

    console.log("📦 Submitting Report:", payload);

    this.reportService.createReport(payload).subscribe({
      next: () => alert('✅ Report created successfully!'),
      error: (err) => {
        console.error('❌ Creation failed:', err);
        alert('Error creating report. Check console for details.');
      }
    });
  }
}
