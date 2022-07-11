import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaoCaoDanhSachVaMaCacTramComponent } from './bao-cao-danh-sach-va-ma-cac-tram.component';

describe('BaoCaoDanhSachVaMaCacTramComponent', () => {
  let component: BaoCaoDanhSachVaMaCacTramComponent;
  let fixture: ComponentFixture<BaoCaoDanhSachVaMaCacTramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaoCaoDanhSachVaMaCacTramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaoCaoDanhSachVaMaCacTramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
