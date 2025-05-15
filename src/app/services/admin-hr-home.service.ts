import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminHrHomeService {
 private apiUrl = environment.apiUrl;
 
   constructor(private http: HttpClient) {}
 // For Leave Type Distribution (using query string `month=MM-YYYY`)
getLeaveTypeDistribution(mr: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/dashboard/leave-type-distribution`, {
    params: { mr }
  });
}

// For Leave Status Distribution (using query string `mr=MM-YYYY`)
getLeaveStatusDistribution(mr: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/dashboard/leave-status-distribution`, {
    params: { mr }
  });
}

  
  getApprovedLeavesByEmployee() {
    return this.http.get<{ year: number; approved_leaves_by_employee: { name: string; total_days: number }[] }>(
      `${this.apiUrl}/dashboard/approved-leaves-by-employee`
    );
  }
  getApprovedLeavesByYear() {
    return this.http.get<any>(`${this.apiUrl}/dashboard/compare-leaves-by-year`);
  }
  getAuthenticatedUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/home/user/info`);
  }
  
  getApprovedLeavesThisMonth() {
    return this.http.get<{ approved_this_month: number }>(`${this.apiUrl}/dashboard/count/approved`);
  }
  getLeavesToday(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/leaves/today`);
  }
  
  getRejectedLeavesThisMonth() {
    return this.http.get<{ rejected_this_month: number }>(`${this.apiUrl}/dashboard/count/rejected`);
  }

  getOnHoldLeavesThisMonth() {
    return this.http.get<{ on_hold_this_month: number }>(`${this.apiUrl}/dashboard/count/on-hold`);
  }
  getUpcomingHolidays(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/home/holidays/upcoming`);
  }
}
