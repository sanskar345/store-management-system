import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GivePaymentDialogComponent } from './give-payment-dialog.component';

describe('GivePaymentDialogComponent', () => {
  let component: GivePaymentDialogComponent;
  let fixture: ComponentFixture<GivePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GivePaymentDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GivePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
