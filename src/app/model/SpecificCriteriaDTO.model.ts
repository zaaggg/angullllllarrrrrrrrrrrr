import { Department } from './department.model';

export interface SpecificCriteriaDTO {
  description: string;
  implementationResponsibles: Department[];
  checkResponsibles: Department[];
}
