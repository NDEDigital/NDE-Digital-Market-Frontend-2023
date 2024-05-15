import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyApprovalGridViewComponent } from './company-approval-grid-view.component';

describe('CompanyApprovalGridViewComponent', () => {
  let component: CompanyApprovalGridViewComponent;
  let fixture: ComponentFixture<CompanyApprovalGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyApprovalGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyApprovalGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
