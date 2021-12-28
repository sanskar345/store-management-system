import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceDialogComponent } from './create-invoice-dialog.component';

describe('CreateInvoiceDialogComponent', () => {
  let component: CreateInvoiceDialogComponent;
  let fixture: ComponentFixture<CreateInvoiceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
