import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ReportService } from '../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../model/user.model';
import { CommonModule } from '@angular/common';

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
  users: User[] = [];
  departments: any[] = [];
  protocolId!: number;
  usersByDepartment: { [key: number]: User[] } = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private reportService: ReportService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.protocolId = Number(params.get('protocolId'));
      console.log('✅ Protocol ID from route:', this.protocolId);
    });


    this.reportForm = this.fb.group({
      type: [''],  // now input by the user
      serialNumber: [''],
      equipmentDescription: [''],
      designation: [''],
      manufacturer: [''],
      immobilization: [''],
      serviceSeg: [''],
      businessUnit: ['']
    });

    this.userService.getAllUsersExceptAdmins().subscribe((users) => {
      this.users = users;
      this.departments = [...new Set(users.map(u => u.department.id))].map(id => {
        return { id, name: users.find(u => u.department.id === id)!.department.name };
      });

      this.departments.forEach((dept) => {
        this.reportForm.addControl(`department_${dept.id}`, this.fb.control(''));
        this.usersByDepartment[dept.id] = users.filter(u => u.department.id === dept.id);
      });
    });
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
