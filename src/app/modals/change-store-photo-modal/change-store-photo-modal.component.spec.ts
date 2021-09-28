import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeStorePhotoModalComponent } from './change-store-photo-modal.component';

describe('ChangeStorePhotoModalComponent', () => {
  let component: ChangeStorePhotoModalComponent;
  let fixture: ComponentFixture<ChangeStorePhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeStorePhotoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeStorePhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
