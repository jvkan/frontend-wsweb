import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PaymentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a payment', () => {
    const file = new File(['x'], 'r.png');
    service.registerPayment(1, 'GAS', 5, file).subscribe();

    const req = http.expectOne('http://localhost:8080/api/payments');
    expect(req.request.method).toBe('POST');
    const body = req.request.body as FormData;
    expect(body.get('eventId')).toBe('1');
    expect(body.get('paymentType')).toBe('GAS');
    expect(body.get('amount')).toBe('5');
    expect(body.get('receipt')).toBe(file);
    req.flush({});
  });

  it('should get my payments', () => {
    service.getMyPayments(2).subscribe();
    const req = http.expectOne('http://localhost:8080/api/payments/user/2');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should get receipt image', () => {
    service.getReceiptImage(3).subscribe();
    const req = http.expectOne('http://localhost:8080/api/payments/3/receipt');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob());
  });

  it('should get payments for event', () => {
    service.getPaymentsForEvent(4).subscribe();
    const req = http.expectOne('http://localhost:8080/api/payments/event/4');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should approve a payment', () => {
    service.approvePayment(5).subscribe();
    const req = http.expectOne('http://localhost:8080/api/payments/5/approve');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should get summary for event', () => {
    service.getSummaryForEvent(6).subscribe();
    const req = http.expectOne('http://localhost:8080/api/payments/summary/6');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});
