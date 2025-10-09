import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sellerhome } from './sellerhome';

describe('Sellerhome', () => {
  let component: Sellerhome;
  let fixture: ComponentFixture<Sellerhome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sellerhome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sellerhome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
