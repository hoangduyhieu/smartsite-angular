import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanhBaoCreateOrEditComponent } from './canh-bao-create-or-edit.component';

describe('CanhBaoCreateOrEditComponent', () => {
  let component: CanhBaoCreateOrEditComponent;
  let fixture: ComponentFixture<CanhBaoCreateOrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanhBaoCreateOrEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanhBaoCreateOrEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
