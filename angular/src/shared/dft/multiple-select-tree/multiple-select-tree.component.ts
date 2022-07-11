import { PermissionTreeComponent } from './../components/permission-tree.component';
import { PermissionTreeEditModel } from './../components/permission-tree-edit.model';
import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import { FlatTreeSelectDto } from '@shared/service-proxies/service-proxies';
import { isNil } from 'lodash';

@Component({
  selector: 'app-multiple-select-tree',
  templateUrl: './multiple-select-tree.component.html',
  styleUrls: ['./multiple-select-tree.component.scss']
})
export class MultipleSelectTreeComponent extends AppComponentBase implements OnChanges {

  @Output() onSelect = new EventEmitter<number[]>();
  @ViewChild('permissionTree', { static: true }) permissionTree: PermissionTreeComponent;
  @ViewChild('treeItem', { static: true }) treeItem: ElementRef;
  @ViewChild('btn', { static: true }) btn: ElementRef;
  @Input() dataEdit: PermissionTreeEditModel;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataEdit.currentValue !== changes.dataEdit.previousValue) {
      if (this.dataEdit.data[0].parentName != null) {
        this.dataEdit.data[0].parentName = null;
      }
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
