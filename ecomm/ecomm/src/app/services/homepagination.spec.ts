import { TestBed } from '@angular/core/testing';

import { Homepagination } from './homepagination';

describe('Homepagination', () => {
  let service: Homepagination;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Homepagination);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
