import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) { }

  getTasksByProjectId(projectId: number): Observable<Task[]> {
    return this.http.get<ApiResponse<Task[]>>(`${this.apiUrl}?projectId=${projectId}`)
      .pipe(map(response => response.data));
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<ApiResponse<Task>>(this.apiUrl, task)
      .pipe(map(response => response.data));
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task)
      .pipe(map(response => response.data));
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}