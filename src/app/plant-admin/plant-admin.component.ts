import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';import { Plant } from '../model/plant.model';
import { PlantAdminService } from '../services/plant-admin.service';
import { PublicService } from '../services/public.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plant-admin',
  templateUrl: './plant-admin.component.html',
  styleUrls: ['./plant-admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class PlantAdminComponent implements OnInit {
  plants: Plant[] = [];
  plantForm: FormGroup;
  loading = false;

  constructor(
    private plantService: PlantAdminService,
    private publicService: PublicService,
    private fb: FormBuilder,
  ) {
    this.plantForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],

    });
  }

  ngOnInit(): void {
    this.loadPlants();
  }

  loadPlants(): void {
    this.publicService.getPlants().subscribe(plants => this.plants = plants);

  }

  addPlant(): void {
    if (this.plantForm.invalid) return;

    const plantData = {
      name: this.plantForm.value.name,
      address: this.plantForm.value.address
    };

    this.plantService.addPlant(plantData).subscribe({
      next: (res) => {
        alert(res.message);
        this.plantForm.reset();
        this.loadPlants();
      },
      error: (err) => {
        alert(err.error.message || 'Failed to add plant');
      }
    });
  }


  deletePlant(id: number): void {
    if (confirm('Are you sure you want to delete this plant?')) {
      this.plantService.deletePlant(id).subscribe({
        next: (res) => {
          alert(res.message);
          this.loadPlants();
        },
        error: () => alert('Failed to delete plant')
      });
    }
  }
}
