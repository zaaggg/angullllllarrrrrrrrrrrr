import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from '../model/plant.model';



@Injectable({
  providedIn: 'root'
})
export class PlantAdminService {
  private baseUrl = 'http://localhost:8081/api/admin-plants';

  constructor(private http: HttpClient) {}

  // ✅ Add new plant
  addPlant(plantData: { name: string, address: string }): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ message: string }>(`${this.baseUrl}/add`, plantData, { headers });
  }

  // ✅ Delete plant by ID
  deletePlant(id: number): Observable<{ message: string }> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<{ message: string }>(`${this.baseUrl}/delete/${id}`, { headers });
  }
}
