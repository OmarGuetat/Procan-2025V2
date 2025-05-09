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
   getLeaveTypeDistribution() {
    return this.http.get<{ leave_distribution: { leave_type: string; percentage: number }[] }>(
      `${this.apiUrl}/dashboard/leave-type-distribution`
    );
  }
  getLeaveStatusDistribution(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard/leave-status-distribution`);
  }
  getApprovedLeavesByEmployee() {
    return this.http.get<{ year: number; approved_leaves_by_employee: { name: string; total_days: number }[] }>(
      `${this.apiUrl}/dashboard/approved-leaves-by-employee`
    );
  }
  getApprovedLeavesByYear() {
    return this.http.get<any>(`${this.apiUrl}/dashboard/compare-leaves-by-year`);
  }
  
}
