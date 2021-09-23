import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemCategoryModalComponent } from './add-item-category-modal.component';

describe('AddItemCategoryModalComponent', () => {
  let component: AddItemCategoryModalComponent;
  let fixture: ComponentFixture<AddItemCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
