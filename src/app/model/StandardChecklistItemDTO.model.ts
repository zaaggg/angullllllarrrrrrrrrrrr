import { Department } from "./department.model";

export interface StandardChecklistItemDTO {
  entryId: number;
  criteriaId: number;
  criteriaDescription: string;
  checkResponsible: Department;
  implementationResponsible: Department;
  implemented: boolean;
  action: string;
  responsableAction: string;
  deadline: string;
  successControl: string;
  updated: boolean;
  editable: boolean;
  isFilled: boolean ; // 👈 add this

}
