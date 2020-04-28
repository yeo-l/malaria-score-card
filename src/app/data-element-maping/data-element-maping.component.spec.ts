import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataElementMapingComponent } from './data-element-maping.component';

describe('DataElementMapingComponent', () => {
  let component: DataElementMapingComponent;
  let fixture: ComponentFixture<DataElementMapingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataElementMapingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataElementMapingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
