import { Component, OnInit } from '@angular/core';
import { ReportEntryService } from '../services/report-entry.service';
import { ActivatedRoute } from '@angular/router';
import { StandardChecklistItemDTO } from '../model/StandardChecklistItemDTO.model';
import { SpecificChecklistItemDTO } from '../model/SpecificChecklistItemDTO.model';
import { MaintenanceFormDTO } from '../model/maintenance-form-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaintenanceForm } from '../model/maintenance-form.model';

@Component({
  selector: 'app-fill-report',
  templateUrl: './fill-report.component.html',
  styleUrls: ['./fill-report.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class FillReportComponent implements OnInit {
  reportId!: number;
  standardChecklist: StandardChecklistItemDTO[] = [];
  specificChecklist: SpecificChecklistItemDTO[] = [];
  maintenanceForm!: MaintenanceFormDTO;

  editableKeys: (keyof MaintenanceForm)[] = [
    'powerCircuit', 'controlCircuit', 'fuseValue', 'frequency',
    'phaseBalanceTest380v', 'phaseBalanceTest210v',
    'insulationResistanceMotor', 'insulationResistanceCable',
    'machineSizeHeight', 'machineSizeLength', 'machineSizeWidth'
  ];

  constructor(
    private reportEntryService: ReportEntryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('reportId');
      if (id) {
        this.reportId = +id;
        console.log('[ROUTE] Report ID:', this.reportId);
        this.loadData();
      } else {
        console.error('[ROUTE] No reportId found in route');
      }
    });
  }

  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }

  getDepartmentNames(departments?: { name: string }[]): string {
    return departments?.map(dep => dep.name).join(', ') || '';
  }

  canEditMaintenancePart(): boolean {
    return this.maintenanceForm?.canEditMaintenance === true;
  }

  canEditShePart(): boolean {
    return this.maintenanceForm?.canEditShe === true;
  }

  loadData() {
    this.reportEntryService.getStandardChecklist(this.reportId).subscribe({
      next: (data) => {
        console.log('[STANDARD] Loaded:', data);
        this.standardChecklist = data.map(item => ({
          ...item,
          isFilled: false // ✅ initialize isFilled
        }));
      },
      error: (err) => {
        console.error('[STANDARD] Failed to load:', err);
      }
    });

    this.reportEntryService.getSpecificChecklist(this.reportId).subscribe({
      next: (data) => {
        console.log('[SPECIFIC] Loaded:', data);
        this.specificChecklist = data;
      },
      error: (err) => {
        console.error('[SPECIFIC] Failed to load:', err);
      }
    });

    this.reportEntryService.getMaintenanceForm(this.reportId).subscribe({
      next: data => {
        console.log("[MAINTENANCE FORM]", data);
        this.maintenanceForm = data;
      },
      error: err => {
        console.error("[MAINTENANCE] Failed to load:", err);
      }
    });
  }
  submitSpecificChecklist() {
    const filledEntries = this.specificChecklist
      .filter(e => e.isFilled)
      .map(e => ({
        id: e.entryId,
        homologation: e.homologation,
        action: e.action?.trim() || '-',
        responsableAction: e.responsableAction?.trim() || '-',
        deadline: e.deadline?.trim() || '-',
        successControl: e.successControl?.trim() || '-',
        isUpdated: true
      }));

    if (filledEntries.length === 0) {
      alert('Aucun champ spécifique rempli à enregistrer.');
      return;
    }

    this.reportEntryService.updateMultipleSpecificEntries(filledEntries).subscribe({
      next: (res) => {
        this.specificChecklist.forEach(e => e.isFilled = false);
        alert(`✅ ${res.message}`);
      },
      error: (err) => {
        console.error('[SPECIFIC] Batch update failed:', err);
        alert('❌ Échec de l\'enregistrement de la checklist spécifique. Veuillez réessayer.');
      }
    });
  }


  updateMaintenanceForm() {
    this.reportEntryService.updateMaintenanceForm(this.reportId, this.maintenanceForm.form).subscribe({
      next: (res) => {
        console.log('[MAINTENANCE] Success:', res?.message || res);
      },
      error: (error) => {
        console.error('[MAINTENANCE] Form update failed:', error);
      }
    });
  }

  hasFilledStandardEntries(): boolean {
    return this.standardChecklist.some(item => item.isFilled === true);
  }

  hasFilledSpecificEntries(): boolean {
    return this.specificChecklist.some(item => item.isFilled === true);
  }

  submitStandardChecklist() {
    const filledEntries = this.standardChecklist
      .filter(e => e.isFilled)
      .map(e => ({
        id: e.entryId,
        implemented: e.implemented,
        action: e.action?.trim() || '-', // Default to '-' if null or empty
        responsableAction: e.responsableAction?.trim() || '-',
        deadline: e.deadline?.trim() || '-',
        successControl: e.successControl?.trim() || '-',
        isUpdated: true
      }));

    if (filledEntries.length === 0) {
      alert('Aucun champ rempli à enregistrer.');
      return;
    }

    this.reportEntryService.updateMultipleStandardEntries(filledEntries).subscribe({
      next: (res) => {
        this.standardChecklist.forEach(e => e.isFilled = false);
        alert(`✅ ${res.message}`);
      },
      error: (err) => {
        console.error('[STANDARD] Batch update failed:', err);
        alert('❌ Échec de l\'enregistrement de la checklist. Veuillez réessayer.');
      }
    });
  }





}
