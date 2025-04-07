import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiUrl = environment.apiUrl 
  constructor(private http: HttpClient) {}

  getByName(name: string) {
    return this.http.get<any>(`${environment.apiUrl}/by-name`, { params: { name } });
  }

  createCompany(data: any) {
    return this.http.post<any>('${environment.apiUrl}/companies', data);
  }

  updateCompany(id: number, data: any) {
    return this.http.put<any>(`${environment.apiUrl}/${id}`, data);
  }
}
