import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Import environment
@Injectable({
  providedIn: 'root',
})
export class LeaveBalanceService {
  private apiUrl = environment.apiUrl+'/leave-limits'; 

  constructor(private http: HttpClient) {}

  getLeaveBalances(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  addLeaveBalance(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateLeaveBalance(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteLeaveBalance(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
