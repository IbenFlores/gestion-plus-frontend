import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }

  getUsersByCompanyId(companyId: number): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}?companyId=${companyId}`)
      .pipe(map(response => response.data));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, user)
      .pipe(map(response => response.data));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.apiUrl}/${id}`, user)
      .pipe(map(response => response.data));
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}