import { Role } from "./role.enum";

export interface NewUserRequestDTO {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  departmentId: number;
  plantId: number;
  role: Role ;
}
