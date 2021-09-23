import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivePaymentModalComponent } from './give-payment-modal.component';

describe('GivePaymentModalComponent', () => {
  let component: GivePaymentModalComponent;
  let fixture: ComponentFixture<GivePaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivePaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivePaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
