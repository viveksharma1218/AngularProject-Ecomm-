import { TestBed } from '@angular/core/testing';

import { Allproduct } from './allproduct';

describe('Allproduct', () => {
  let service: Allproduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Allproduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
