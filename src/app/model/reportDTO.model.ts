import {  AssignedUserDTO } from "./assignedUserDTO.model";

export interface ReportDTO {
  id: number;
  type: string;
  serialNumber: string;
  equipmentDescription: string;
  designation: string;
  manufacturer: string;
  immobilization: string;
  serviceSeg: string;
  businessUnit: string;
  createdAt: string; // use Date if you want to parse it later
  createdByEmail: string;
  assignedUsers: AssignedUserDTO[];
}

