import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportRequest } from '../model/reportRequest.model';
import { catchError, Observable, throwError } from 'rxjs';
import { ReportDTO } from '../model/reportDTO.model';
import { ValidationChecklistItem } from '../model/validation-checklist-item.model';
import { ValidationEntryUpdateDTO } from '../model/validation-entry-update.dto';


@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `http://localhost:8081/api/rapports`;

  constructor(private http: HttpClient) {}

  createReport(req: ReportRequest) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create`, req, { headers });
  }

  getReportsAssignedToMe() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ReportDTO[]>(`${this.apiUrl}/assigned`, { headers });
  }
  getReportsCreatedByMe() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ReportDTO[]>(`${this.apiUrl}/my-created`, { headers });
  }



}

