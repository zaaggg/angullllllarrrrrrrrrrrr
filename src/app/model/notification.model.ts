import { NotificationType } from "./notificationType.enum";
import { User } from "./user.model";

export interface Notification {
  id: number;
  description: string;
  link: string;
  time: string;       // LocalDateTime as string
  seen: boolean;
  notificationType: NotificationType;
  user?: User;         // Optional, if returned in some responses
}
