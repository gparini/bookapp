import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponentComponent } from './logout-component.component';

describe('LogoutComponentComponent', () => {
  let component: LogoutComponentComponent;
  let fixture: ComponentFixture<LogoutComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
