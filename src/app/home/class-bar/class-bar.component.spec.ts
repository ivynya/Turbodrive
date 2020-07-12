import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassBarComponent } from './class-bar.component';

describe('ClassBarComponent', () => {
  let component: ClassBarComponent;
  let fixture: ComponentFixture<ClassBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClassBarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
