import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private postApi = 'http://127.0.0.1:8000/api/admin/users'; 

  constructor(private http: HttpClient) {}

  // Method to add a candidate
  addCandidate(candidate: any): Observable<any> {
    // Get the token (you may want to retrieve this from localStorage or a service)
    const token = localStorage.getItem('authToken');  // Or replace this with your actual token fetching logic

    // Set up the Authorization header with the Bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Make the POST request with the headers
    return this.http.post(this.postApi, candidate, { headers });
  }
}
