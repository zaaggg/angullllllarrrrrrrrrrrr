import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportService } from '../services/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssignedUserDTO } from '../model/assignedUserDTO.model';
import { UserAssignmentDTO } from '../model/userAssignmentDTO.model'; // make sure this exists

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
    this.reportForm = this.fb.group({
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
      equipmentDescription: ['', Validators.required],
      designation: ['', Validators.required],
      manufacturer: ['', Validators.required],
      immobilization: [''], // Optional
      serviceSeg: ['', Validators.required],
      businessUnit: ['', Validators.required]
    });

    this.route.queryParamMap.subscribe(params => {
      const protocolIdParam = params.get('protocolId');
      if (protocolIdParam) {
        this.protocolId = Number(protocolIdParam);
        this.loadRequiredUsers(this.protocolId);
      }
    });
  }

  loadRequiredUsers(protocolId: number) {
    this.reportService.getRequiredUsers(protocolId).subscribe({
      next: (users) => {
        this.requiredUsers = users;
        this.usersByDepartment = {};

        users.forEach(user => {
          const deptId = user.department.id;
          if (!this.usersByDepartment[deptId]) {
            this.usersByDepartment[deptId] = [];
          }
          this.usersByDepartment[deptId].push(user);
        });

        this.departments = Object.keys(this.usersByDepartment).map(id => ({
          id: +id,
          name: this.usersByDepartment[+id][0]?.department.name || 'Département'
        }));

        this.departments.forEach(dept => {
          const controlName = `department_${dept.id}`;
          if (!this.reportForm.contains(controlName)) {
            this.reportForm.addControl(controlName, new FormControl('', Validators.required));
          }
        });
      },
      error: (err) => {
        console.error('[REQUIRED USERS ERROR]', err);
      }
    });
  }

  submitReport() {
    if (this.reportForm.invalid) {
      alert('❌ Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const formValues = this.reportForm.value;

    const assignedUsers: UserAssignmentDTO[] = this.departments.map(dept => {
      const userId = Number(formValues[`department_${dept.id}`]);
      return { departmentId: dept.id, userId: userId };
    });

    const payload = {
      ...formValues,
      protocolId: this.protocolId,
      assignedUsers
    };

    this.reportService.createReport(payload).subscribe({
      next: () => alert('✅ Rapport créé avec succès !'),
      error: (err) => {
        console.error('❌ Creation failed:', err);
        alert('Erreur lors de la création du rapport. Vérifiez la console pour plus de détails.');
      }
    });
  }
}
