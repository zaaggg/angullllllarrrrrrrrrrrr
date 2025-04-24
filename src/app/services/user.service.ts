import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `http://localhost:8081/api/public`;

  constructor(private http: HttpClient) {}

  getAllUsersExceptAdmins() : Observable<User[]>  {
      return this.http.get<User[]>(`${this.apiUrl}/non-admins`);
  }
}
