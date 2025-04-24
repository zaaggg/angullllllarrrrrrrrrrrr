// services/protocol.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Protocol } from '../model/protocol.model';

@Injectable({ providedIn: 'root' })
export class ProtocolService {
  private apiUrl = 'http://localhost:8081/api/protocols'; // Adjust if needed

  constructor(private http: HttpClient) {}

  getAllProtocolsGroupedByType() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<{ [key: string]: any[] }>(`${this.apiUrl}/grouped`, { headers });
  }

}
