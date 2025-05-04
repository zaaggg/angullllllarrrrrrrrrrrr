import { Department } from "./department.model";
import { Plant } from "./plant.model";
import { Role } from "./role.enum";


export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePhoto: string;
  role: Role;
  department: Department;
  plant: Plant;
  loggedIn: boolean; // 🔥 Important: Online / Offline
}
