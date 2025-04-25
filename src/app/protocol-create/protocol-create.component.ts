import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProtocolService } from '../services/protocol.service';
import { Department } from '../model/department.model';
import { PublicService } from '../services/public.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-protocol-create',
  templateUrl: './protocol-create.component.html',
  styleUrls: ['./protocol-create.component.css'],
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ProtocolCreateComponent implements OnInit {
  protocolForm!: FormGroup;
  departments: Department[] = [];

  constructor(private fb: FormBuilder, private protocolService: ProtocolService, private publicService: PublicService) {}

  ngOnInit(): void {
    this.loadDepartments();

    this.protocolForm = this.fb.group({
      name: ['', Validators.required],
      protocolType: ['Homologation', Validators.required],
      specificCriteria: this.fb.array([])
    });

    // Add default one
    this.addCriteria();
  }

  loadDepartments() {
    this.publicService.getDepartments().subscribe(depts => {
      this.departments = depts;
    });
  }

  get specificCriteria() {
    return this.protocolForm.get('specificCriteria') as FormArray;
  }

  addCriteria() {
    this.specificCriteria.push(this.fb.group({
      description: ['', Validators.required],
      implementationResponsibles: [[]],
      checkResponsibles: [[]]
    }));
  }

  removeCriteria(index: number) {
    this.specificCriteria.removeAt(index);
  }

  submit() {
    if (this.protocolForm.invalid) return;

    const rawValue = this.protocolForm.value;

    const formatted = {
      name: rawValue.name,
      protocolType: rawValue.protocolType,
      specificCriteria: rawValue.specificCriteria.map((crit: any) => ({
        description: crit.description,
        implementationResponsibles: this.departments.filter(d => crit.implementationResponsibles.includes(d.id)),
        checkResponsibles: this.departments.filter(d => crit.checkResponsibles.includes(d.id))
      }))
    };

    this.protocolService.createProtocol(formatted).subscribe({
      next: res => {
        alert('✅ Protocol created successfully.');
        this.protocolForm.reset();
        this.specificCriteria.clear();
        this.addCriteria();
      },
      error: err => {
        console.error('❌ Protocol creation failed', err);
        alert('❌ Error creating protocol');
      }
    });
  }

}
