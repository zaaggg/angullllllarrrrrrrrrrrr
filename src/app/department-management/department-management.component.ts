import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DepartmentAdminService } from '../services/department-admin.service';
import { PublicService } from '../services/public.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-department-management',
  templateUrl: './department-management.component.html',
  styleUrls: ['./department-management.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,  RouterModule]
})
export class DepartmentManagementComponent implements OnInit {
  departments: any[] = [];
  departmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentAdminService,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.departmentForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  loadDepartments() {
    this.publicService.getDepartments().subscribe(deps => this.departments = deps);

  }

  addDepartment() {
    if (this.departmentForm.invalid) return;

    const name = this.departmentForm.value.name;
    this.departmentService.addDepartment(name).subscribe({
      next: () => {
        alert('✅ Département ajouté avec succès.');
        this.departmentForm.reset();
        this.loadDepartments();
      },
      error: () => alert('❌ Échec de l\'ajout du département.')
    });
  }

  deleteDepartment(id: number) {
    if (!confirm('Confirmer la suppression ?')) return;

    this.departmentService.deleteDepartment(id).subscribe({
      next: () => {
        alert('🗑️ Département supprimé avec succès.');
        this.loadDepartments();
      },
      error: () => alert('❌ Échec de la suppression du département.')
    });
  }

}
