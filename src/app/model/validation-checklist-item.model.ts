import { Department } from './department.model';
import { ProtocolType } from './protocol-type.enum';

export interface ValidationChecklistItem {
  id: number;
  criteria: string;
  department: Department;
  protocolType: ProtocolType;
  status: boolean | null;
  reason: string | null;
  date: string | null; // ISO date format
  updated: boolean;
}
