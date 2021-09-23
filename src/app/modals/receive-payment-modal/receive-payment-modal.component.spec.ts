import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentModalComponent } from './receive-payment-modal.component';

describe('ReceivePaymentModalComponent', () => {
  let component: ReceivePaymentModalComponent;
  let fixture: ComponentFixture<ReceivePaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivePaymentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
