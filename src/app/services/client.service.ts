import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getClients(name: string = '', email: string = '', phone_number: string = '', page: number = 1): Observable<any> {
    return this.http.get(`${this.apiUrl}/show/clients`, {
      params: {
        name,
        email,
        phone_number,
        page: page.toString(), // Ensure the page is sent as a string
      }
    });
  }
  

  addClient(clientData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clients/add`, clientData);
  }

  updateClient(id: number, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clients/${id}`, clientData);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clients/${id}`);
  }
}
