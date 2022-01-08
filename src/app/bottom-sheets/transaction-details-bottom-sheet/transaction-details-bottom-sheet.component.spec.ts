import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDetailsBottomSheetComponent } from './transaction-details-bottom-sheet.component';

describe('TransactionDetailsBottomSheetComponent', () => {
  let component: TransactionDetailsBottomSheetComponent;
  let fixture: ComponentFixture<TransactionDetailsBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionDetailsBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDetailsBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
