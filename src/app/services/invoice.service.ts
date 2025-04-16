import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = environment.apiUrl + '/invoices';

  constructor(private http: HttpClient) {}
  confirm(invoiceData: any): Observable<any> {
    // Envoyer la requête avec les données de la facture
    return this.http.post(`${this.apiUrl}/store`, invoiceData, { withCredentials: true });
  }
  
  stepOne(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step-one`, data, { withCredentials: true });
  }

  stepTwo(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step-two`, data, { withCredentials: true });
  }

  stepThree(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/step-three`, data, { withCredentials: true });
  }
}
