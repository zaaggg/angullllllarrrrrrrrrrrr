import { Department } from "./department.model";
import { Plant } from "./plant.model";

export interface AssignedUserDTO {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto: string;
  department: Department;
  plant: Plant;
}
