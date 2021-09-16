import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInvoiceModalComponent } from './create-invoice-modal.component';

describe('CreateInvoiceModalComponent', () => {
  let component: CreateInvoiceModalComponent;
  let fixture: ComponentFixture<CreateInvoiceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInvoiceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInvoiceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
