import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerListGridViewComponent } from './seller-list-grid-view.component';

describe('SellerListGridViewComponent', () => {
  let component: SellerListGridViewComponent;
  let fixture: ComponentFixture<SellerListGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerListGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerListGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
