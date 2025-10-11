import { TestBed } from '@angular/core/testing';

import { SellerAddProduct } from './seller-add-product';

describe('SellerAddProduct', () => {
  let service: SellerAddProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerAddProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
