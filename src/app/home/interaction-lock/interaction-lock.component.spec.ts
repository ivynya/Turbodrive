import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionLockComponent } from './interaction-lock.component';

describe('ClassBarComponent', () => {
  let component: InteractionLockComponent;
  let fixture: ComponentFixture<InteractionLockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InteractionLockComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
