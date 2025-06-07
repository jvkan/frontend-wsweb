import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EventService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request active events', () => {
    service.getActiveEvents().subscribe();
    const req = http.expectOne('http://localhost:8080/api/events/active');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should request all events', () => {
    service.getAllEvents().subscribe();
    const req = http.expectOne('http://localhost:8080/api/events');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should post new event', () => {
    const ev = { name: 'test' };
    service.createEvent(ev).subscribe();
    const req = http.expectOne('http://localhost:8080/api/events');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(ev);
    req.flush(ev);
  });

  it('should toggle active state', () => {
    service.setActive(1, true).subscribe();
    const req = http.expectOne('http://localhost:8080/api/events/1/activate');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ active: true });
    req.flush({});
  });
});
