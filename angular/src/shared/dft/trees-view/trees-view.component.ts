import { AppComponentBase } from '@shared/app-component-base';
import { Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { PermissionTreeComponent } from '../components/permission-tree.component';
import { PermissionTreeEditModel } from '../components/permission-tree-edit.model';
import { FlatTreeSelectDto } from '@shared/service-proxies/service-proxies';
import { isNil } from 'lodash';

@Component({
  selector: 'app-trees-view',
  templateUrl: './trees-view.component.html',
  styleUrls: ['./trees-view.component.scss']
})
export class TreesViewComponent extends AppComponentBase implements OnChanges {

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
