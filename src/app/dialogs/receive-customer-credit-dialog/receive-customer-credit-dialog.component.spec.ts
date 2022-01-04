import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCustomerCreditDialogComponent } from './receive-customer-credit-dialog.component';

describe('ReceiveCustomerCreditDialogComponent', () => {
  let component: ReceiveCustomerCreditDialogComponent;
  let fixture: ComponentFixture<ReceiveCustomerCreditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveCustomerCreditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCustomerCreditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
