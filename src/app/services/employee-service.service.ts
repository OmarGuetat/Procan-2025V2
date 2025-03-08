import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Import environment

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  username: string;
  email: string;
  password: string;
  company: string;
  start_date: string;
  role: string;
  initial_leave_balance: number;
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = environment.apiUrl;  // Uses the apiUrl from environment

  constructor(private http: HttpClient) {}

  updateEmployee(id: string, employee: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/admin/users/${id}`, employee);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/users/${id}`);
  }

  searchEmployees(query: string, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/users?search=${query}&page=${page}`);
  }

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/sidebar`);
  }

  getProfileData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/profile`);
  }

  updateProfile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/profile/update`, formData);
  }

  updateUserImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/profile/update-avatar`, formData);
  }

  getLeaveRequests(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leave-balances/${userId}`);
  }
}
