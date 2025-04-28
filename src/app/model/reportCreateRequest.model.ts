
import { UserAssignmentDTO } from './userAssignmentDTO.model';

export interface ReportCreateRequest {
  protocolId: number;
  type: string;
  serialNumber: string;
  equipmentDescription: string;
  designation: string;
  manufacturer: string;
  immobilization: string;
  serviceSeg: string;
  businessUnit: string;
  assignedUsers: UserAssignmentDTO[];
}
