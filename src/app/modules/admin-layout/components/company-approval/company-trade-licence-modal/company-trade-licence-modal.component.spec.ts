import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTradeLicenceModalComponent } from './company-trade-licence-modal.component';

describe('CompanyTradeLicenceModalComponent', () => {
  let component: CompanyTradeLicenceModalComponent;
  let fixture: ComponentFixture<CompanyTradeLicenceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyTradeLicenceModalComponent]
    });
    fixture = TestBed.createComponent(CompanyTradeLicenceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
