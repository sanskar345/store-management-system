import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItemCategoryDialogComponent } from './add-item-category-dialog.component';

describe('AddItemCategoryDialogComponent', () => {
  let component: AddItemCategoryDialogComponent;
  let fixture: ComponentFixture<AddItemCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddItemCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddItemCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
