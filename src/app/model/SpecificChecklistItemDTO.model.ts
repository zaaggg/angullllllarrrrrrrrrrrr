import { Department } from "./department.model";

export interface SpecificChecklistItemDTO {
  entryId: number;
  criteriaId: number;
  criteriaDescription: string;
  checkResponsibles: Department[];
  implementationResponsibles: Department[];
  homologation: boolean | null;
  action: string | null;
  responsableAction: string | null;
  deadline: string | null;
  successControl: string | null;
  isUpdated: boolean;
  editable: boolean;
  isFilled: boolean ;
}
