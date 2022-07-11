import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoCanhBaoTramComponent } from './bao-cao-canh-bao-tram.component';

describe('BaoCaoCanhBaoTramComponent', () => {
  let component: BaoCaoCanhBaoTramComponent;
  let fixture: ComponentFixture<BaoCaoCanhBaoTramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaoCaoCanhBaoTramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoCanhBaoTramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
