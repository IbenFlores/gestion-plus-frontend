import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deliverable } from '../models/deliverable.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class DeliverableService {
  private apiUrl = 'http://localhost:8080/api/deliverables';

  constructor(private http: HttpClient) { }

  getDeliverablesByProjectId(projectId: number): Observable<Deliverable[]> {
    return this.http.get<ApiResponse<Deliverable[]>>(`${this.apiUrl}?projectId=${projectId}`)
      .pipe(map(response => response.data));
  }

  getDeliverableById(id: number): Observable<Deliverable> {
    return this.http.get<ApiResponse<Deliverable>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createDeliverable(deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.post<ApiResponse<Deliverable>>(this.apiUrl, deliverable)
      .pipe(map(response => response.data));
  }

  updateDeliverable(id: number, deliverable: Partial<Deliverable>): Observable<Deliverable> {
    return this.http.put<ApiResponse<Deliverable>>(`${this.apiUrl}/${id}`, deliverable)
      .pipe(map(response => response.data));
  }

  deleteDeliverable(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
