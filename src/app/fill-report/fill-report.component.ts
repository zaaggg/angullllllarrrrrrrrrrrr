import { Component, OnInit } from '@angular/core';
import { ReportEntryService } from '../services/report-entry.service';
import { ActivatedRoute } from '@angular/router';
import { StandardChecklistItemDTO } from '../model/StandardChecklistItemDTO.model';
import { SpecificChecklistItemDTO } from '../model/SpecificChecklistItemDTO.model';
import { MaintenanceFormDTO } from '../model/maintenance-form-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaintenanceForm } from '../model/maintenance-form.model';
import { ValidationChecklistItem } from '../model/validation-checklist-item.model';
import { ValidationEntryUpdateDTO } from '../model/validation-entry-update.dto';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

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
  validationChecklist: ValidationChecklistItem[] = [];
  maintenanceForm!: MaintenanceFormDTO;
  currentUser!: User;
  today: string = new Date().toISOString().split('T')[0];



  editableKeys: (keyof MaintenanceForm)[] = [
    'powerCircuit', 'controlCircuit', 'fuseValue', 'frequency',
    'phaseBalanceTest380v', 'phaseBalanceTest210v',
    'insulationResistanceMotor', 'insulationResistanceCable',
    'machineSizeHeight', 'machineSizeLength', 'machineSizeWidth'
  ];

  constructor(
    private reportEntryService: ReportEntryService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('reportId');
      if (id) {
        this.reportId = +id;
        console.log('[ROUTE] Report ID:', this.reportId);
        this.loadData();
        this.currentUser = this.authService.getUserFromToken(); // ✅ Get user from token/localStorage

      } else {
        console.error('[ROUTE] No reportId found in route');
      }
    });
  }

  canEditValidation(entry: ValidationChecklistItem): boolean {
    return (
      !entry.updated &&
      this.currentUser?.department?.id === entry.department.id
    );
  }

  showDate(entry: ValidationChecklistItem): string {
    if (entry.updated && entry.date) {
      return entry.date;
    }

    if (this.canEditValidation(entry)) {
      return this.today; // Show today's date if user can edit and not yet signed
    }

    return ''; // For other users, leave it empty
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


  updateValidationEntry(entry: ValidationChecklistItem) {
    if (entry.updated) return;

    const dto: ValidationEntryUpdateDTO = {
      status: entry.status!,
      reason: entry.status === false ? entry.reason || '-' : null,
      date: this.today
    };

    this.reportEntryService.updateValidationEntry(entry.id, dto).subscribe({
      next: (res) => {
        console.log("[✅ BACKEND RESPONSE]", res);
        entry.updated = true;
        entry.date = this.today;
        alert('✅ Validation enregistrée avec succès.');
      },
      error: (err) => {
        console.error('[VALIDATION UPDATE ERROR]', err);
        alert('❌ Échec de la mise à jour de la validation.');
      }
    });
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

    this.reportEntryService.getValidationChecklist(this.reportId).subscribe({
      next: data => {
        this.validationChecklist = data;
        console.log('[VALIDATION CHECKLIST]', data);
      },
      error: err => {
        console.error('[VALIDATION CHECKLIST] Failed to load:', err);
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
