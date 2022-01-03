import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivePaymentDialogComponent } from './receive-payment-dialog.component';

describe('ReceivePaymentDialogComponent', () => {
  let component: ReceivePaymentDialogComponent;
  let fixture: ComponentFixture<ReceivePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivePaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
