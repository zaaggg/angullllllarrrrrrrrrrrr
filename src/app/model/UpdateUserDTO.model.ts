import { Role } from "./role.enum";

export interface UpdateUserDTO {
  departmentId: number;
  plantId: number;
  phoneNumber: string;
  role: Role;
}
