import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.show).toBeFalse();
  });

  it('should toggleShow correctly', () => {
    component.toggleShow();
    expect(component.show).toBeTrue();
    component.toggleShow();
    expect(component.show).toBeFalse();
  });

  it('should hide correctly', () => {
    // Setup
    component.show = true;
    expect(component.show).toBeTrue();
    // Test
    component.hide();
    expect(component.show).toBeFalse();
  });
});
