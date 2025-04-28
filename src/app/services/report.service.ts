import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ReportCreateRequest } from '../model/reportCreateRequest.model';
import { ValidationChecklistItem } from '../model/validation-checklist-item.model';
import { ValidationEntryUpdateDTO } from '../model/validation-entry-update.dto';
import { AssignedUserDTO } from '../model/assignedUserDTO.model';
import { ReportMetadataDTO } from '../model/reportMetadataDTO.model';
import { ImmobilizationUpdateDTO } from '../model/immobilization-updateDTO.model';
import { ReportDTO } from '../model/reportDTO.model';


@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiUrl = `http://localhost:8081/api/rapports`;

  constructor(private http: HttpClient) {}

  createNewReport(req: ReportCreateRequest) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/create`, req, { headers });
  }

  getRequiredUsers(protocolId: number): Observable<AssignedUserDTO[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AssignedUserDTO[]>(`${this.apiUrl}/required-users/${protocolId}`, { headers });
  }

  updateImmobilization(reportId: number, dto: ImmobilizationUpdateDTO) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<{ message: string }>(`${this.apiUrl}/rapports/update-immobilization/${reportId}`, dto, { headers });
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

  getReportMetadata(reportId: number): Observable<ReportMetadataDTO> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<ReportMetadataDTO>(`${this.apiUrl}/metadata/${reportId}`, { headers });
  }

}

