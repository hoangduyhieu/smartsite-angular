import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmCreateOrEditComponent } from './alarm-create-or-edit.component';

describe('AlarmCreateOrEditComponent', () => {
  let component: AlarmCreateOrEditComponent;
  let fixture: ComponentFixture<AlarmCreateOrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmCreateOrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmCreateOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
