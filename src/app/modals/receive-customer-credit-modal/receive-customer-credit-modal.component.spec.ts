import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCustomerCreditModalComponent } from './receive-customer-credit-modal.component';

describe('ReceiveCustomerCreditModalComponent', () => {
  let component: ReceiveCustomerCreditModalComponent;
  let fixture: ComponentFixture<ReceiveCustomerCreditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveCustomerCreditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCustomerCreditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
