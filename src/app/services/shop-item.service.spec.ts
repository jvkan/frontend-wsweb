import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ShopItemService } from './shop-item.service';

describe('ShopItemService', () => {
  let service: ShopItemService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ShopItemService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request all items', () => {
    service.getAll().subscribe();
    const req = http.expectOne('http://localhost:8080/api/items');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should post a new item', () => {
    const item = { name: 'a' };
    service.create(item).subscribe();
    const req = http.expectOne('http://localhost:8080/api/items');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(item);
    req.flush(item);
  });

  it('should delete an item', () => {
    service.delete(1).subscribe();
    const req = http.expectOne('http://localhost:8080/api/items/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
