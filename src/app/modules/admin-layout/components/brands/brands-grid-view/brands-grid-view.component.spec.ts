import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsGridViewComponent } from './brands-grid-view.component';

describe('BrandsGridViewComponent', () => {
  let component: BrandsGridViewComponent;
  let fixture: ComponentFixture<BrandsGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsGridViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
