import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../models/project.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private apiUrl = 'http://localhost:8080/api/projects';

  constructor(private http: HttpClient) { }

  getProjectsByCompanyId(companyId: number): Observable<Project[]> {
    return this.http.get<ApiResponse<Project[]>>(`${this.apiUrl}?companyId=${companyId}`)
      .pipe(map(response => response.data));
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<ApiResponse<Project>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<ApiResponse<Project>>(this.apiUrl, project)
      .pipe(map(response => response.data));
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<ApiResponse<Project>>(`${this.apiUrl}/${id}`, project)
      .pipe(map(response => response.data));
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}