// src/app/pages/user-payments/user-payments.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from 'src/app/services/payment.service';
import { Payment } from 'src/app/models/payment';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-payments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.css']
})
export class UserPaymentsComponent implements OnInit {
  eventId!: number;
  payments: Payment[] = [];
  loading = false;
  errorMsg = '';

  // For showing receipt in modal
  showModal = false;
  modalImageUrl: string | null = null;

  constructor(
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Get eventId from route parameters: e.g. /my-payments/:eventId
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('eventId');
      if (idParam) {
        this.eventId = +idParam;
        this.fetchPayments();
      } else {
        this.errorMsg = 'Event ID missing in URL';
      }
    });
  }

  fetchPayments() {
    this.loading = true;
    this.paymentService.getMyPayments(this.eventId).subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load payments', err);
        this.errorMsg = 'Could not load your payments. Try again.';
        this.loading = false;
      }
    });
  }

  /**
   * Fetches receipt image as a Blob, converts to object URL, and shows in modal
   */
  viewReceipt(payment: Payment) {
    this.paymentService.getReceiptImage(payment.id).subscribe({
      next: (blob) => {
        // Create a local URL for the blob
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

  /** Close the receipt modal and revoke the URL */
  closeModal() {
    if (this.modalImageUrl) {
      URL.revokeObjectURL(this.modalImageUrl);
    }
    this.showModal = false;
    this.modalImageUrl = null;
  }
}
