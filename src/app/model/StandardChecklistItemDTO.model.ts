import { Department } from "./department.model";

export interface StandardChecklistItemDTO {
  entryId: number;
  criteriaId: number;
  criteriaDescription: string;
  checkResponsible: Department;
  implementationResponsible: Department;
  implemented: boolean | null;
  action: string | null;
  responsableAction: string | null;
  deadline: string | null;
  successControl: string | null;
  updated: boolean;
  editable: boolean;
  isFilled: boolean ; // 👈 add this

}
