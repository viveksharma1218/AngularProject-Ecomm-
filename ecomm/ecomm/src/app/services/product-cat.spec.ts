import { TestBed } from '@angular/core/testing';

import { ProductCat } from './product-cat';

describe('ProductCat', () => {
  let service: ProductCat;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductCat);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
