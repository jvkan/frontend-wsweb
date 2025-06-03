// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';
import { PaymentSummary } from '../models/payment-summary';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  /**
   * Register a new payment.
   * Returns the saved Payment entity.
   */
  registerPayment(
    eventId: number,
    paymentType: 'GAS' | 'FOOD' | 'PERSONAL' | 'OTHER',
    amount: number,
    receiptFile: File
  ): Observable<Payment> {
    const formData = new FormData();
    formData.append('eventId', eventId.toString());
    formData.append('paymentType', paymentType);
    formData.append('amount', amount.toString());
    formData.append('receipt', receiptFile, receiptFile.name);

    return this.http.post<Payment>(this.baseUrl, formData);
  }

  /** User: list all payments for the current user in a given event */
  getMyPayments(eventId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/user/${eventId}`);
  }

  /** Fetch receipt image as Blob for a given payment */
  getReceiptImage(paymentId: number): Observable<Blob> {
    // NOTE: set responseType to 'blob'
    return this.http.get(
      `${this.baseUrl}/${paymentId}/receipt`,
      { responseType: 'blob' }
    );
  }

  /** Admin: list all payments for an event */
  getPaymentsForEvent(eventId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/event/${eventId}`);
  }

  /** Admin: approve a payment */
  approvePayment(paymentId: number): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.baseUrl}/${paymentId}/approve`,
      {} // no body required
    );
  }

  /** Admin: get summary totals for an event */
  getSummaryForEvent(eventId: number): Observable<PaymentSummary> {
    return this.http.get<PaymentSummary>(`${this.baseUrl}/summary/${eventId}`);
  }
}
