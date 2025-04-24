import { Department } from "./department.model";

export interface SpecificChecklistItemDTO {
  entryId: number;
  criteriaId: number;
  criteriaDescription: string;
  checkResponsibles: Department[];
  implementationResponsibles: Department[];
  homologation: boolean;
  action: string;
  responsableAction: string;
  deadline: string;
  successControl: string;
  isUpdated: boolean;
  editable: boolean;
  isFilled: boolean ; 
}
