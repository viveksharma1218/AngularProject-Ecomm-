import { TestBed } from '@angular/core/testing';

import { UserCart } from './user-cart';

describe('UserCart', () => {
  let service: UserCart;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCart);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
