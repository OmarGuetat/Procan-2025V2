import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
interface PublicHoliday {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
  number_of_days?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PublicHolidayService {
  private apiUrl = environment.apiUrl+'/public-holidays';
  private GlobalUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
getAvailableYears(): Observable<number[]> {
  return this.http.get<number[]>(`${this.GlobalUrl}/holiday-years`);
}

  getHolidays(
  page: number = 1,
  name?: string,
  year?: string
): Observable<{
  data: PublicHoliday[],
  meta: {
    current_page: number;
    per_page: number;
    total_pages: number;
    total_holidays: number;
  }
}> {
  let params = `?page=${page}`;
  if (name) params += `&name=${encodeURIComponent(name)}`;
  if (year) params += `&year=${year}`;

  return this.http.get<{
    data: PublicHoliday[],
    meta: {
      current_page: number;
      per_page: number;
      total_pages: number;
      total_holidays: number;
    }
  }>(`${this.apiUrl}${params}`);
}
  

  addHoliday(holiday: PublicHoliday): Observable<any> {
    return this.http.post(this.apiUrl, holiday);
  }

  updateHoliday(id: number, holiday: PublicHoliday): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, holiday);
  }

  deleteHoliday(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
