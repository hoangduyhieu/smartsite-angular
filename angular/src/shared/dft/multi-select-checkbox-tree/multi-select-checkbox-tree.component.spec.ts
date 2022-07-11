import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelectCheckBoxTreeComponent } from './multi-select-checkbox-tree.component';


describe('MultipleSelectTreeComponent', () => {
  let component: MultiSelectCheckBoxTreeComponent;
  let fixture: ComponentFixture<MultiSelectCheckBoxTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiSelectCheckBoxTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectCheckBoxTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
