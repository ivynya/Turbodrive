import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DefaultData } from '../core/mocks/test-data';

import { RouterTestingModule } from '@angular/router/testing';
import * as Store from 'electron-store';

import { DataService } from '../core/services';
import { ClassComponent } from './class.component';

describe('ClassComponent', () => {
  let component: ClassComponent;
  let fixture: ComponentFixture<ClassComponent>;
  const store: Store = new Store();
  let dataService: DataService;
  let dataSpyRead;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassComponent ],
      imports: [ RouterTestingModule ],
      providers: [ DataService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    store.store = DefaultData;

    fixture = TestBed.createComponent(ClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    dataService = fixture.debugElement.injector.get(DataService);
    dataSpyRead = spyOn(dataService, 'markRead');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should call DataService mark read functions correctly', () => {
    component.markAsRead("123", "announcements", "456");
    expect(dataSpyRead).toHaveBeenCalledWith("123", "announcements", "456");
  });
});
