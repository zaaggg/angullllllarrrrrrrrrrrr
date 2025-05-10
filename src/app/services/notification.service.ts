
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDTO } from '../model/notification-dto.model';
import { Notification } from '../model/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl =  'http://localhost:8081/api/notifications';

  constructor(private http: HttpClient) {}

  getUserNotifications(): Observable<Notification[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Notification[]>(`${this.apiUrl}/user`, { headers });
  }

  createNotification(dto: NotificationDTO): Observable<Notification> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<Notification>(`${this.apiUrl}/add`, dto, { headers });
  }

  deleteNotification(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers });
  }


markAsSeen(notificationId: number) {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put<Notification>(
    `${this.apiUrl}/${notificationId}/seen`, // ✅ Remove extra "notifications"
    {},
    { headers }
  );
}





}
