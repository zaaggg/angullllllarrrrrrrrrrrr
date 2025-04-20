import { MaintenanceForm } from "./maintenance-form.model";

export interface MaintenanceFormDTO {
  form: MaintenanceForm;
  canEditMaintenance: boolean;
  canEditShe: boolean;
}
