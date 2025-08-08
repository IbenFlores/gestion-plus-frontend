import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Company } from '../models/company.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = 'http://localhost:8080/api/companies';

  constructor(private http: HttpClient) { }

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<ApiResponse<Company[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getCompanyById(id: number): Observable<Company> {
    return this.http.get<ApiResponse<Company>>(`${this.apiUrl}/${id}`)
      .pipe(map(response => response.data));
  }

  createCompany(company: Partial<Company>): Observable<Company> {
    return this.http.post<ApiResponse<Company>>(this.apiUrl, company)
      .pipe(map(response => response.data));
  }

  updateCompany(id: number, company: Partial<Company>): Observable<Company> {
    return this.http.put<ApiResponse<Company>>(`${this.apiUrl}/${id}`, company)
      .pipe(map(response => response.data));
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`)
      .pipe(map(() => undefined));
  }
}