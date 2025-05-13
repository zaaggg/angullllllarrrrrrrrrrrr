import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/user.model';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `http://localhost:8081/api/users`;

  constructor(private http: HttpClient) {}



updateMyProfile(profileData: any, profilePhoto?: File): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const formData = new FormData();
  formData.append('profileData', new Blob([JSON.stringify(profileData)], { type: 'application/json' }));
  if (profilePhoto) {
    formData.append('profilePhoto', profilePhoto);
  }

  return this.http.put(`${this.apiUrl}/me`, formData, {
    headers: headers
    // No need to set responseType if backend returns JSON properly (recommended)
  });
}

}

