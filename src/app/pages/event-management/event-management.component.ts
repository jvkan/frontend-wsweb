// src/app/pages/event-management/event-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { CampEvent } from 'src/app/models/camp-event';
import { LoggerService } from 'src/app/services/logger.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {
  events: CampEvent[] = [];
  form!: FormGroup;
  errorMsg = '';
  successMsg = '';
  loading = false;

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Build the event creation form
    this.form = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: [''],
      active: [false]
    });

    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (ev) => (this.events = ev),
      error: (err) => {
        console.error('Failed to load events', err);
        this.errorMsg = 'Could not load events.';
      }
    });
  }

  /** Create a new event */
  onCreate() {
    if (this.form.invalid) {
      this.errorMsg = 'Please fill all required fields.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';

    const newEvent: Partial<CampEvent> = {
      name: this.form.value.name,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
      description: this.form.value.description,
      active: this.form.value.active
    };

    this.eventService.createEvent(newEvent).subscribe({
      next: (ev) => {
        this.successMsg = 'Event created.';
        this.loading = false;
        this.form.reset({ active: false });
        this.loadEvents();
      },
      error: (err) => {
        console.error('Create event failed', err);
        this.errorMsg = err.error?.message || 'Failed to create event.';
        this.loading = false;
      }
    });
  }

  /** Toggle active/inactive */
  toggleActive(ev: CampEvent) {
    this.eventService.setActive(ev.id, !ev.active).subscribe({
      next: (updated) => {
        ev.active = updated.active;
        // Show a brief success message?
      },
      error: (err) => {
        console.error('Failed to toggle active', err);
        this.errorMsg = 'Could not update event status.';
      }
    });
  }
}
