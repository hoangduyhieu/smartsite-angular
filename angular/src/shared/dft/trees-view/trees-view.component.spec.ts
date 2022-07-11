import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreesViewComponent } from './trees-view.component';

describe('TreesViewComponent', () => {
  let component: TreesViewComponent;
  let fixture: ComponentFixture<TreesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
