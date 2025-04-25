import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../model/department.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8081/api';

  getDepartments(): Observable<Department[]> {
    // No need for authentication for public endpoints
    return this.http.get<Department[]>(`${this.apiUrl}/public/departments`);
  }
}
