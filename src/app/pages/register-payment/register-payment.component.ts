// src/app/pages/register-payment/register-payment.component.ts
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
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-register-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-payment.component.html',
  styleUrls: ['./register-payment.component.css']
})
export class RegisterPaymentComponent implements OnInit {
  form!: FormGroup;
  events: CampEvent[] = [];
  submitting = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 1) Initialize form
    this.form = this.fb.group({
      eventId: [null, Validators.required],
      paymentType: ['GAS', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      receipt: [null, Validators.required] // we'll handle file separately
    });

    // 2) Load active events from the backend
    this.eventService.getActiveEvents().subscribe({
      next: (ev) => this.events = ev,
      error: (err) => {
        console.error('Failed to load events', err);
        this.errorMsg = 'Could not load events. Please try again later.';
      }
    });
  }

  /** Handle file input change */
  onFileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      // Simple client‐side validation: only allow images <= 5MB
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        this.errorMsg = 'Only JPG or PNG images are allowed.';
        this.form.patchValue({ receipt: null });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.errorMsg = 'Maximum file size is 5MB.';
        this.form.patchValue({ receipt: null });
        return;
      }
      this.form.patchValue({ receipt: file });
      this.errorMsg = '';
    }
  }

  /** Submit the form to create a new payment */
  onSubmit() {
    if (this.form.invalid) {
      this.errorMsg = 'Please fill out all required fields.';
      return;
    }
    this.submitting = true;
    this.errorMsg = '';
    this.successMsg = '';

    const { eventId, paymentType, amount, receipt } = this.form.value;

    this.paymentService.registerPayment(
      +eventId,
      paymentType,
      +amount,
      receipt as File
    ).subscribe({
      next: (payment) => {
        this.successMsg = 'Payment registered successfully!';
        this.submitting = false;
        this.form.reset({ paymentType: 'GAS' });
        // Optionally navigate to history:
        // this.router.navigate(['/my-payments', eventId]);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMsg = err.error?.message || 'Registration failed. Try again.';
        this.submitting = false;
      }
    });
  }
}
