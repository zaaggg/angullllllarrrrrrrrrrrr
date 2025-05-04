import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../model/department.model';
import { Plant } from '../model/plant.model';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { UserAdminService } from '../services/user-admin.service';
import { PublicService } from '../services/public.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-management',
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AdminUserManagementComponent implements OnInit {
  users: User[] = [];
  departments: Department[] = [];
  plants: Plant[] = [];
  editForms: { [userId: number]: FormGroup } = {};
  addUserForm!: FormGroup;

  constructor(
    private userService: UserService,
    private userAdminService: UserAdminService,
    private fb: FormBuilder,
    private publicService: PublicService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.initAddUserForm();
  }

  loadAllData() {
    this.userService.getAllUsersExceptAdmins().subscribe(users => this.users = users);
    this.publicService.getDepartments().subscribe(deps => this.departments = deps);
    this.publicService.getPlants().subscribe(plants => this.plants = plants);
  }

  initAddUserForm() {
    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      departmentId: [null, Validators.required],
      plantId: [null, Validators.required],
      role: ['EMPLOYEE', Validators.required]
    });
  }

  initEditForm(user: User): FormGroup {
    return this.fb.group({
      departmentId: [user.department?.id, Validators.required],
      plantId: [user.plant?.id, Validators.required],
      phoneNumber: [user.phoneNumber, Validators.required],
      role: [user.role, Validators.required]
    });
  }

  getEditForm(userId: number): FormGroup {
    if (!this.editForms[userId]) {
      const user = this.users.find(u => u.id === userId);
      this.editForms[userId] = this.initEditForm(user!);
    }
    return this.editForms[userId];
  }

  // ✅ Helper method to cast AbstractControl to FormControl for HTML binding
  asFormControl(control: AbstractControl | null): FormControl {
    return control as FormControl;
  }

  updateUser(userId: number): void {
    const form = this.getEditForm(userId);
    if (form.invalid) return;

    this.userAdminService.updateUser(userId, form.value).subscribe({
      next: res => {
        console.log('[✅ User UPDATED]', res.message);
        alert('✅ User mise à jour avec succès.');
      },
      error: err => {
        console.error('[❌ User UPDATE ERROR]', err);
        alert('❌ Échec de la mise à jour de user.');
      }
    });
  }


  addUser(): void {
    if (this.addUserForm.invalid) return;

    this.userAdminService.addUser(this.addUserForm.value).subscribe({
      next: (response) => {
        const message = response?.message || '✅ Utilisateur ajouté et email envoyé';
        alert(message);
        this.addUserForm.reset();
        this.addUserForm.get('role')?.setValue('EMPLOYEE');
        this.loadAllData();
      },
      error: (err) => {
        alert('❌ Échec de l\'ajout de l\'utilisateur');
        console.error('Add user error:', err);
      }
    });
  }

  deleteUser(userId: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userAdminService.deleteUser(userId).subscribe({
      next: (res) => {
        alert(res.message);
        this.loadAllData();
      },
      error: (err) => {
        console.error('❌ Delete user error:', err);
        alert('❌ Failed to delete user');
      }
    });
  }


}
