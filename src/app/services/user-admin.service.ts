import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewUserRequestDTO } from '../model/new-user-request.dto';
import { UpdateUserDTO } from '../model/UpdateUserDTO.model';
import { User } from '../model/user.model';


@Injectable({
  providedIn: 'root',
})
export class UserAdminService {
  private apiUrl = `http://localhost:8081/api/admin-users`;

  constructor(private http: HttpClient) {}



  updateUser(userId: number, updateDto: UpdateUserDTO): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/update/${userId}`, updateDto, { headers }
    );
  }


  addUser(newUser: NewUserRequestDTO): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/add`,
      newUser,
      { headers }
    );
  }

  deleteUser(userId: number): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/delete/${userId}`, { headers });
  }




}
