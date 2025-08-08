import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskDependency } from '../models/task-dependency.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TaskDependencyService {
  private apiUrl = 'http://localhost:8080/api/task-dependencies';

  constructor(private http: HttpClient) { }

  getDependenciesByTaskId(taskId: number): Observable<TaskDependency[]> {
    return this.http.get<ApiResponse<TaskDependency[]>>(`${this.apiUrl}?taskId=${taskId}`)
      .pipe(map(response => response.data));
  }

  createTaskDependency(dependency: Partial<TaskDependency>): Observable<TaskDependency> {
    return this.http.post<ApiResponse<TaskDependency>>(this.apiUrl, dependency)
      .pipe(map(response => response.data));
  }

  deleteTaskDependency(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}
