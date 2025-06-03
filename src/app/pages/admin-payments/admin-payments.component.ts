// src/app/pages/admin-payments/admin-payments.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { PaymentService } from 'src/app/services/payment.service';
import { CampEvent } from 'src/app/models/camp-event';
import { Payment } from 'src/app/models/payment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-payments.component.html',
  styleUrls: ['./admin-payments.component.css']
})
export class AdminPaymentsComponent implements OnInit {
  events: CampEvent[] = [];
  selectedEventId: number | null = null;
  payments: Payment[] = [];
  summary: any = null;
  loadingPayments = false;
  loadingSummary = false;
  errorMsg = '';
  showModal = false;
  modalImageUrl: string | null = null;

  constructor(
    private eventService: EventService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    // Load all events for dropdown
    this.eventService.getAllEvents().subscribe({
      next: (ev) => (this.events = ev),
      error: (err) => {
        console.error('Failed to load events', err);
        this.errorMsg = 'Could not load events.';
      }
    });
  }

  /** When admin selects an event, load its payments and summary */
  onEventChange() {
    this.errorMsg = '';
    if (this.selectedEventId !== null) {
      this.fetchPayments(this.selectedEventId);
      this.fetchSummary(this.selectedEventId);
    } else {
      this.payments = [];
      this.summary = null;
    }
  }

  fetchPayments(eventId: number) {
    this.loadingPayments = true;
    this.paymentService.getPaymentsForEvent(eventId).subscribe({
      next: (data) => {
        this.payments = data;
        this.loadingPayments = false;
      },
      error: (err) => {
        console.error('Failed to load payments', err);
        this.errorMsg = 'Could not load payments.';
        this.loadingPayments = false;
      }
    });
  }

  fetchSummary(eventId: number) {
    this.loadingSummary = true;
    this.paymentService.getSummaryForEvent(eventId).subscribe({
      next: (data) => {
        this.summary = data;
        this.loadingSummary = false;
      },
      error: (err) => {
        console.error('Failed to load summary', err);
        this.errorMsg = 'Could not load summary.';
        this.loadingSummary = false;
      }
    });
  }

  /** Admin clicks “Approve” on a payment */
  approve(payment: Payment) {
    this.paymentService.approvePayment(payment.id).subscribe({
      next: (updated) => {
        payment.approved = updated.approved;
      },
      error: (err) => {
        console.error('Approve failed', err);
        this.errorMsg = 'Could not approve payment.';
      }
    });
  }

  /** Show receipt image in modal (same logic as user) */
  viewReceipt(payment: Payment) {
    this.paymentService.getReceiptImage(payment.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.modalImageUrl = url;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Failed to load receipt image', err);
        this.errorMsg = 'Could not load receipt image.';
      }
    });
  }

  closeModal() {
    if (this.modalImageUrl) {
      URL.revokeObjectURL(this.modalImageUrl);
    }
    this.showModal = false;
    this.modalImageUrl = null;
  }
}
