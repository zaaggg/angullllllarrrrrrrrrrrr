import { Component, OnInit } from '@angular/core';
import { ReportEntryService } from '../services/report-entry.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { StandardChecklistItemDTO } from '../model/StandardChecklistItemDTO.model';
import { SpecificChecklistItemDTO } from '../model/SpecificChecklistItemDTO.model';
import { MaintenanceFormDTO } from '../model/maintenance-form-dto.model';
import { MaintenanceForm } from '../model/maintenance-form.model';
import { ValidationChecklistItem } from '../model/validation-checklist-item.model';
import { ValidationEntryUpdateDTO } from '../model/validation-entry-update.dto';

import { User } from '../model/user.model';
import { ReportService } from '../services/report.service';
import { ReportMetadataDTO } from '../model/reportMetadataDTO.model';
import { ImmobilizationUpdateDTO } from '../model/immobilization-updateDTO.model';

@Component({
  selector: 'app-fill-report',
  templateUrl: './fill-report.component.html',
  styleUrls: ['./fill-report.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class FillReportComponent implements OnInit {
  reportId!: number;
  currentUser!: User;
  today: string = new Date().toISOString().split('T')[0];

  standardChecklist: StandardChecklistItemDTO[] = [];
  specificChecklist: SpecificChecklistItemDTO[] = [];
  validationChecklist: ValidationChecklistItem[] = [];
  maintenanceForm!: MaintenanceFormDTO;
  reportMetadata!: ReportMetadataDTO;

  constructor(
    private reportEntryService: ReportEntryService,
    private reportService: ReportService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('reportId');
      if (id) {
        this.reportId = +id;
        this.currentUser = this.authService.getUserFromToken();
        this.loadData();
      }
    });
  }

  loadData() {
    this.reportEntryService.getStandardChecklist(this.reportId).subscribe({
      next: data => this.standardChecklist = data.map(e => ({ ...e, isFilled: false })),
      error: err => console.error('[STANDARD] Load error:', err)
    });

    this.reportEntryService.getSpecificChecklist(this.reportId).subscribe({
      next: data => this.specificChecklist = data,
      error: err => console.error('[SPECIFIC] Load error:', err)
    });

    this.reportEntryService.getMaintenanceForm(this.reportId).subscribe({
      next: data => this.maintenanceForm = data,
      error: err => console.error('[MAINTENANCE] Load error:', err)
    });

    this.reportEntryService.getValidationChecklist(this.reportId).subscribe({
      next: data => this.validationChecklist = data,
      error: err => console.error('[VALIDATION] Load error:', err)
    });

    this.reportService.getReportMetadata(this.reportId).subscribe({
      next: data => {
        this.reportMetadata = data;
        console.log('[METADATA]', data);
      },
      error: err => console.error('[METADATA] Load error:', err)
    });
  }

  canEditImmobilization(): boolean {
    return this.reportMetadata?.canEditImmobilization === true;
  }

  updateImmobilization() {
    const dto = { immobilization: this.reportMetadata.immobilization };

    this.reportService.updateImmobilization(this.reportId, dto).subscribe({
      next: res => {
        console.log('[✅ IMMOBILIZATION UPDATED]', res.message);
        alert('✅ Immobilisation mise à jour avec succès.');
      },
      error: err => {
        console.error('[❌ IMMOBILIZATION UPDATE ERROR]', err);
        alert('❌ Échec de la mise à jour de l\'immobilisation.');
      }
    });
  }



  canEditValidation(entry: ValidationChecklistItem): boolean {
    return !entry.updated && this.currentUser?.department?.id === entry.department.id;
  }

  showDate(entry: ValidationChecklistItem): string {
    if (entry.updated && entry.date) return entry.date;
    return this.canEditValidation(entry) ? this.today : '';
  }

  getDepartmentNames(departments?: { name: string }[]): string {
    return departments?.map(d => d.name).join(', ') || '';
  }

  canEditMaintenancePart(): boolean {
    return this.maintenanceForm?.canEditMaintenance === true;
  }

  canEditShePart(): boolean {
    return this.maintenanceForm?.canEditShe === true;
  }

  submitStandardChecklist() {
    const filledEntries = this.standardChecklist
      .filter(e => e.isFilled)
      .map(e => ({
        id: e.entryId,
        implemented: e.implemented,
        action: e.action?.trim() || '-',
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
      next: res => {
        this.standardChecklist.forEach(e => e.isFilled = false);
        alert(`✅ ${res.message}`);
      },
      error: err => {
        console.error('[STANDARD] Update failed:', err);
        alert('❌ Échec de l\'enregistrement de la checklist standard.');
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
      next: res => {
        this.specificChecklist.forEach(e => e.isFilled = false);
        alert(`✅ ${res.message}`);
      },
      error: err => {
        console.error('[SPECIFIC] Update failed:', err);
        alert('❌ Échec de l\'enregistrement de la checklist spécifique.');
      }
    });
  }

  updateValidationEntry(entry: ValidationChecklistItem) {
    if (entry.updated) return;

    const dto: ValidationEntryUpdateDTO = {
      status: entry.status!,
      reason: entry.status === false ? entry.reason || '-' : null,
      date: this.today
    };

    this.reportEntryService.updateValidationEntry(entry.id, dto).subscribe({
      next: () => {
        entry.updated = true;
        entry.date = this.today;
        alert('✅ Validation enregistrée avec succès.');
      },
      error: err => {
        console.error('[VALIDATION] Update error:', err);
        alert('❌ Échec de la mise à jour de la validation.');
      }
    });
  }

  updateMaintenanceForm() {
    this.reportEntryService.updateMaintenanceForm(this.reportId, this.maintenanceForm.form).subscribe({
      next: res => console.log('[MAINTENANCE] Updated:', res),
      error: err => console.error('[MAINTENANCE] Update failed:', err)
    });
  }

  hasFilledStandardEntries(): boolean {
    return this.standardChecklist.some(item => item.isFilled === true);
  }

  hasFilledSpecificEntries(): boolean {
    return this.specificChecklist.some(item => item.isFilled === true);
  }

  formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).replace(/_/g, ' ');
  }
}
