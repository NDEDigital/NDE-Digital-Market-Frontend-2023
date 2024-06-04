import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsModalComponent } from './brands-modal.component';

describe('BrandsModalComponent', () => {
  let component: BrandsModalComponent;
  let fixture: ComponentFixture<BrandsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrandsModalComponent]
    });
    fixture = TestBed.createComponent(BrandsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
