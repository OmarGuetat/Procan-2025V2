import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeHrHomeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCalendarData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/home/calendar`);
  }
  getLeaveBalance(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/employee/home/leave-balance`);
  }
  getLeaveStatusStats() {
    return this.http.get<{ data: { [status: string]: number } }>(
      `${this.apiUrl}/employee/home/leaves-status`
    );
  }
  getAuthenticatedUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/home/user/info`);
  }
}
