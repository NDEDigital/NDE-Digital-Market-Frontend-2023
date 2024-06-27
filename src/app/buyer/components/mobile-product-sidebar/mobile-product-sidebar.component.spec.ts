import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProductSidebarComponent } from './mobile-product-sidebar.component';

describe('MobileProductSidebarComponent', () => {
  let component: MobileProductSidebarComponent;
  let fixture: ComponentFixture<MobileProductSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileProductSidebarComponent]
    });
    fixture = TestBed.createComponent(MobileProductSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
