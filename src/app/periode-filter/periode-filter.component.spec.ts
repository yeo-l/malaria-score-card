import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeFilterComponent } from './periode-filter.component';

describe('PeriodeFilterComponent', () => {
  let component: PeriodeFilterComponent;
  let fixture: ComponentFixture<PeriodeFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
