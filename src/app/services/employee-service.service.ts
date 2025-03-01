import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';


export interface Employee {
  id:string;
  first_name: string;
  last_name: string;
  gender:string;
  username:string;
  email: string;
  password:string;
  company: string;
  start_date: string;
  role: string; 
  initial_leave_balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://127.0.0.1:8000/api/admin/users';
  private api = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}
  updateEmployee(id: string, employee: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/${id}`, employee, { headers });
  }
  deleteEmployee(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }
  searchEmployees(query: string, page: number = 1): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://127.0.0.1:8000/api/admin/users?search=${query}&page=${page}`, { headers });
  }
  getData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get<any>('http://127.0.0.1:8000/api/user/sidebar', { headers });
  }
  getProfileData(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.api}/user/profile`, { headers });
  }
  updateProfile(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.api}/user/profile/update`, formData, { headers });
  }
  updateUserImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post(`${this.api}/user/profile/update-avatar`, formData, { headers });
  }
  
  getLeaveRequests(userId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.get(`${this.api}/leave-balances/${userId}`, { headers });
  }
  
}
