import { NotificationType } from "./notificationType.enum";

export interface NotificationDTO {
  description: string;
  link: string;
  notificationType: NotificationType;
  userId: number;
}
