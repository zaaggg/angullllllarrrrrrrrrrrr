import { Department } from "./department.model";
import { Plant } from "./plant.model";
import { Role } from "./role.enum";


export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department: Department;
  plant: Plant;
}
