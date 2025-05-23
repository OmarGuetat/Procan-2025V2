import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Import environment


@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private apiUrl = environment.apiUrl;  // Use the apiUrl from environment

  constructor(private http: HttpClient) {}

  getLeaveEmployees(query: string, page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users?search=${query}&page=${page}`);
  }

  addLeaveDays(userId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/leave-balances/${userId}`, data);
  }

  // Fetch the leave details for a specific user
  getLeaveDetails(userId: number| null, currentPage: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leave-balances/${userId}?page=${currentPage}`);
  }

  getEmployees(search: string = '', page: number = 1): Observable<any> {
    const params: any = { page };
    if (search) {
      params.search = search;
    }
    return this.http.get<any>(`${this.apiUrl}/users`, { params });
  }

  // Cancel the leave balance
  cancelLeave(leaveId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/leave-balances/${leaveId}`);
  }

  getLeaveRequests(userId: number, year?: number, page: number = 1,type_leave?:string,status?:string): Observable<any> {
    const params: any = { page };
    if (year) {
      params.year = year;
    }
    if (type_leave) {
      params.type_leave = type_leave;
    }
    if (status) {
      params.status = status;
    }
    return this.http.get<any>(`${this.apiUrl}/admin/employees/${userId}/leaves`, { params });
  }

  updateLeaveStatus(leaveId: number, status: string): Observable<any> {
    const url = `${this.apiUrl}/admin/leaves/${leaveId}/status`;
    return this.http.patch(url, { status });
  }
  // Get leave details by leave ID
  getLeaveDetail(leaveId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/leaves/${leaveId}`);
  }
  getUserLeaveRequests(page: number, year?: number, status?: string, leaveType?: string) {
  let params: any = { page };
  if (year) params.year = year;
  if (status) params.status = status;
  if (leaveType) params.leave_type = leaveType;

  return this.http.get<any>(`${this.apiUrl}/employee/leaves`, { params });
}
// Send Email To HR or Admin
notifyRejectionToHR(payload: { start_date: string, leave_type: string, message: string }) {
  return this.http.post(`${this.apiUrl}/leaves/notify-rejection`, payload);
}


  updateLeave(leaveId: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/employee/leaves/${leaveId}`, formData);
  }

  deleteLeave(leaveId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employee/leaves/${leaveId}`);
  }

  downloadLeavePdf(leaveId: number) {
    const url = `${this.apiUrl}/leave/${leaveId}/download`;
    return this.http.get(url, { responseType: 'blob' });
  }

  calculateLeaveDays(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leave/calculate`, formData);
  }

  storeLeaveRequest(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leave/store`, formData);
  }
  // Update Leave Request for Admin
  updateLeaveAdmin(leaveId: number, leaveData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/leave/${leaveId}/update`, leaveData);
  }
}
