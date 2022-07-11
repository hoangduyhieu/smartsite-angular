import { PermissionTreeComponent } from './../components/permission-tree.component';
import { MultiSelectTree, PermissionTreeEditModel } from './../components/permission-tree-edit.model';
import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FlatTreeSelectDto } from '@shared/service-proxies/service-proxies';
import { isNil } from 'lodash';
import { PhanVungTreeCheckBoxComponent } from '../components/phanvung-tree-checkbox.component';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-multi-select-checkbox-tree',
  templateUrl: './multi-select-checkbox-tree.component.html',
  styleUrls: ['./multi-select-checkbox-tree.component.scss']
})
export class MultiSelectCheckBoxTreeComponent extends AppComponentBase implements OnChanges, OnInit {

  @Output() onSelect = new EventEmitter<number[]>();
  @ViewChild('permissionTree', { static: true }) permissionTree: PhanVungTreeCheckBoxComponent;
  @ViewChild('treeItem', { static: true }) treeItem: ElementRef;
  @ViewChild('btn', { static: true }) btn: ElementRef;
  @Input() dataEdit: MultiSelectTree;

  show = true;
  selectedValue = this.l('chose');
  constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.show && !this.btn.nativeElement.contains(event.target)) {
      this.show = !this._isEventFromToggle(event);
    }
  }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataEdit.currentValue !== changes.dataEdit.previousValue) {
      this.permissionTree.editData = changes.dataEdit.currentValue;
    }
  }

  onSelectedChange(event: FlatTreeSelectDto[]) {
    this.selectedValue = event.length > 0 ? event.map(e => e.displayName).join() : this.l('chose');
    this.onSelect.emit(event.map(e => e.id));
  }

  private _isEventFromToggle(event: MouseEvent): boolean {
    return !isNil(this.treeItem) && this.treeItem.nativeElement.contains(event.target);
  }
}
