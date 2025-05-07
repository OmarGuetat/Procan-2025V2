import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = environment.apiUrl + '/invoices';
  private GlobalUrl = environment.apiUrl ;
  constructor(private http: HttpClient) {}
  confirm(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/store`, invoiceData, { withCredentials: true });
  }
  getClientById(id: number) {
    return this.http.get(`${this.GlobalUrl}/clients/${id}`);
  }  
  getAllClients() {
    return this.http.get(`${this.GlobalUrl}/clients`, { withCredentials: true });
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
  sendInvoiceEmail(invoiceId: number): Observable<any> {
    return this.http.get(`${this.GlobalUrl}/invoices/${invoiceId}/send-email`, {
      withCredentials: true
    });
  }
  // invoice.service.ts
downloadInvoicePdf(id: number): Observable<Blob> {
  return this.http.get(`${this.GlobalUrl}/invoices/${id}/download-pdf`, {
    responseType: 'blob'
  });
}

}
