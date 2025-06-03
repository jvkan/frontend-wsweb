// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CampEvent } from '../models/camp-event';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient) {}

  /** List all active events (for users) */
  getActiveEvents(): Observable<CampEvent[]> {
    return this.http.get<CampEvent[]>(`${this.baseUrl}/active`);
  }

  /** Admin: list all events */
  getAllEvents(): Observable<CampEvent[]> {
    return this.http.get<CampEvent[]>(this.baseUrl);
  }

  /** Admin: create a new event */
  createEvent(event: Partial<CampEvent>): Observable<CampEvent> {
    return this.http.post<CampEvent>(this.baseUrl, event);
  }

  /** Admin: toggle active/inactive */
  setActive(eventId: number, active: boolean): Observable<CampEvent> {
    return this.http.put<CampEvent>(
      `${this.baseUrl}/${eventId}/activate`,
      { active }
    );
  }
}
