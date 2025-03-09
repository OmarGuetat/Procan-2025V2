import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // Import environment

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private postApi = `${environment.apiUrl}/admin/users`; // Uses environment API URL

  constructor(private http: HttpClient) {}

  // Method to add a candidate
  addCandidate(candidate: any): Observable<any> {
    return this.http.post(this.postApi, candidate); 
  }
}
