import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { ReportService } from '../services/report.service';

import { ReportCreateRequest } from '../model/reportCreateRequest.model';
import { AssignedUserDTO } from '../model/assignedUserDTO.model';

@Component({
  selector: 'app-report-create',
  templateUrl: './report-create.component.html',
  styleUrls: ['./report-create.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class ReportCreateComponent implements OnInit {
  reportForm!: FormGroup;
  users: AssignedUserDTO[] = [];
  departments: any[] = [];
  usersByDepartment: { [key: number]: AssignedUserDTO[] } = {};
  protocolId!: number;
  isSubmitting = false;
  submitted = false;
  loadingUsers = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getProtocolId();
    this.loadUsers();

  }

  initForm(): void {
    this.reportForm = this.fb.group({
      type: ['', Validators.required],
      serialNumber: ['', Validators.required],
      equipmentDescription: [''],
      designation: [''],
      manufacturer: [''],
      immobilization: [''],
      serviceSeg: [''],
      businessUnit: ['']
    });
  }

  getProtocolId(): void {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('protocolId');
      if (id) {
        this.protocolId = +id;
        console.log('✅ Protocol ID from route:', this.protocolId);
      } else {
        console.log('Aucun protocole sélectionné', 'Erreur');
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.reportService.getRequiredUsers(this.protocolId).subscribe({
      next: (users) => {
        this.users = users;
        console.log(this.users);
        const uniqueDepts = new Map<number, string>();

        users.forEach(user => {
          const deptId = user.department.id;
          const deptName = user.department.name;
          if (!uniqueDepts.has(deptId)) {
            uniqueDepts.set(deptId, deptName);
            this.usersByDepartment[deptId] = [];
          }
          this.usersByDepartment[deptId].push(user);
        });
        console.log('🔍 usersByDepartment:', this.usersByDepartment);

        this.departments = Array.from(uniqueDepts.entries()).map(([id, name]) => ({ id, name }));

        this.departments.forEach(dept => {
          const controlName = `department_${dept.id}`;
          this.reportForm.addControl(controlName, new FormControl('', Validators.required));
        });

        this.loadingUsers = false;
      },
      error: () => {
        this.loadingUsers = false;
        console.log('Impossible de charger les utilisateurs', 'Erreur');
      }
    });
  }

  submitReport(): void {
    this.submitted = true;

    if (this.reportForm.invalid) {
      console.log('Veuillez remplir tous les champs obligatoires', 'Attention');
      this.markFormGroupTouched(this.reportForm);
      return;
    }

    const formValues = this.reportForm.value;

    // ✅ Safely extract and convert userId for each department
    const assignedUsers = this.departments
    .map(dept => {
      const rawValue = formValues[`department_${dept.id}`];
      if (!rawValue || isNaN(Number(rawValue))) {
        console.error(`❌ Invalid userId for department ${dept.name}`);
        return null;
      }
      return {
        departmentId: dept.id,
        userId: Number(rawValue)
      };
    })
    .filter((u): u is { departmentId: number, userId: number } => u !== null);



    // ✅ Debug log before sending
    console.log('✅ Assigned Users:', assignedUsers);

    const payload: ReportCreateRequest = {
      protocolId: this.protocolId,
      type: formValues.type,
      serialNumber: formValues.serialNumber,
      equipmentDescription: formValues.equipmentDescription,
      designation: formValues.designation,
      manufacturer: formValues.manufacturer,
      immobilization: formValues.immobilization || null,
      serviceSeg: formValues.serviceSeg,
      businessUnit: formValues.businessUnit,
      assignedUsers: assignedUsers.filter(u => u.userId !== null) // avoid sending invalid ones
    };

    console.log('📤 Final Payload:', payload);

    this.isSubmitting = true;

    this.reportService.createNewReport(payload).subscribe({
      next: () => {
        console.log('✅ Rapport créé avec succès !');
        this.router.navigate(['/dashboard/report-dashboard/report-list']);
      },
      error: err => {
        console.error('❌ Error creating report:', err);
        console.log('Erreur lors de la création du rapport', 'Erreur');
        this.isSubmitting = false;
      }
    });
  }


  isFieldInvalid(fieldName: string): boolean {
    const control = this.reportForm.get(fieldName);
    return !!control && control.invalid && (control.dirty || control.touched || this.submitted);
  }

  private markFormGroupTouched(group: FormGroup): void {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/report-dashboard/protocol-selection']);
  }
}
