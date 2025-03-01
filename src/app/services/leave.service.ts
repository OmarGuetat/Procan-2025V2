import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://127.0.0.1:8000/api/user/leaves'; 
  private api ='http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  submitLeaveRequest(leaveData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}`, leaveData, { headers });
  }
  getLeaveEmployees(query: string, page: number = 1): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`http://127.0.0.1:8000/api/users?search=${query}&page=${page}`, { headers });
}
    addLeaveDays(userId: number, data: any): Observable<any> {
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post(`${this.api}/leave-balances/${userId}`, data, { headers });
} 
// Fetch the leave details for a specific user
getLeaveDetails(userId: number, currentPage: number): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get<any>(`${this.api}/leave-balances/${userId}?page=${currentPage}`, { headers });
}

getEmployees(search: string = '', page: number = 1): Observable<any> {
  const token = localStorage.getItem('authToken'); // Retrieve token from local storage
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  const params: any = { page };
  if (search) {
    params.search = search;
  }

  return this.http.get<any>(`${this.api}/users`, { headers, params });
}
// Cancel the leave balance
cancelLeave(leaveId: number): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete<any>(`${this.api}/leave-balances/${leaveId}`, { headers });
}
getLeaveRequests(userId: number, year?: number, page: number = 1) { 
  const params: any = { page };
  if (year) {
    params.year = year;
  }

  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any>(`${this.api}/admin/employees/${userId}/leaves`, { params, headers });
}
updateLeaveStatus(leaveId: number, status: string): Observable<any> {
  const url = `${this.api}/admin/leaves/${leaveId}/status`;
  const authToken = localStorage.getItem('authToken'); 

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  });

  return this.http.patch(url, { status }, { headers });
}
getUserLeaveRequests(userId: number, page: number = 1, year?: number): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const params: any = { page };
  if (year) {
    params.year = year;
  }
  return this.http.get<any>(`${this.api}/employee/leaves/${userId}?page=${page}`, { params, headers });
}
updateLeave(leaveId: number, formData: FormData): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.post(`${this.api}/employee/leaves/${leaveId}`, formData,{headers});
}

deleteLeave(leaveId: number): Observable<any> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete(`${this.api}/employee/leaves/${leaveId}`,{headers});
}
downloadLeavePdf(leaveId: number) {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const url = `${this.api}/leave/${leaveId}/download`;
  return this.http.get(url, { responseType: 'blob',headers });
}
}
