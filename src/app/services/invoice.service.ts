import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  getInvoiceHistorique(id: number): Observable<any> {
    return this.http.get(`${this.GlobalUrl}/invoices/${id}/historique`);
  }
  getInvoiceTypeStats(): Observable<any> {
    return this.http.get(`${this.GlobalUrl}/type-stats`);
  }
  
  getInvoices(
    page: number,
    start_date?: string,
    end_date?: string,
    search?: string,
    sort_by_payment_status?: string
  ): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
  
    if (start_date) params = params.set('start_date', start_date);
    if (end_date) params = params.set('end_date', end_date);
    if (search) params = params.set('search', search); 
    if (sort_by_payment_status) params = params.set('sort_by_payment_status', sort_by_payment_status);
  
    return this.http.get(`${this.GlobalUrl}/show/invoices`, { params });
  }
  
  updatePaymentStatus(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.GlobalUrl}/invoices/${id}/payment-status`, payload);
  }
  getServicesByInvoice(id: number): Observable<any> {
    return this.http.get(`${this.GlobalUrl}/invoices/${id}/services`);
  }
  createPartialCreditInvoice(payload: any): Observable<any> {
    return this.http.post(`${this.GlobalUrl}/invoices/transfer-avp`, payload);
  }
  
  // invoice.service.ts
downloadInvoicePdf(id: number): Observable<Blob> {
  return this.http.get(`${this.GlobalUrl}/invoices/${id}/download-pdf`, {
    responseType: 'blob'
  });
}
updateServicesBatch(payload: any): Observable<any> {
  return this.http.put(`${this.GlobalUrl}/invoices/services/batch-update`, payload);
}
getPaymentStatusStats(): Observable<any> {
  return this.http.get<any>(`${this.GlobalUrl}/payment-status`);
}
getPaymentModeStats(): Observable<any> {
  return this.http.get(`${this.GlobalUrl}/payment-mode`);
}

}
