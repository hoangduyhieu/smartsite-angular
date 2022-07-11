// tslint:disable
import { Component, EventEmitter, Input, Output, ViewChild, TemplateRef, Injector } from '@angular/core';
import { TreeviewI18n } from '../../models/treeview-i18n';
import { TreeviewItem } from '../../models/treeview-item';
import { TreeviewConfig } from '../../models/treeview-config';
import { TreeviewComponent } from '../treeview/treeview.component';
import { TreeviewHeaderTemplateContext } from '../../models/treeview-header-template-context';
import { TreeviewItemTemplateContext } from '../../models/treeview-item-template-context';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'ngx-dropdown-treeview',
  templateUrl: './dropdown-treeview.component.html',
  styleUrls: ['./dropdown-treeview.component.scss']
})
export class DropdownTreeviewComponent extends AppComponentBase{
  @Input() buttonClass = 'btn';
  @Input() headerTemplate: TemplateRef<TreeviewHeaderTemplateContext>;
  @Input() itemTemplate: TemplateRef<TreeviewItemTemplateContext>;
  @Input() items: TreeviewItem[];
  @Input() config: TreeviewConfig;
  @Output() selectedChange = new EventEmitter<any[]>(true);
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild(TreeviewComponent, { static: false }) treeviewComponent: TreeviewComponent;
  buttonLabel: string;
  hide =false;
  constructor(
    injector: Injector,
    public i18n: TreeviewI18n,
    private defaultConfig: TreeviewConfig
  ) {
    super(injector);
    this.config = this.defaultConfig;
  }

  onSelectedChange(values: any[]): void {
    this.buttonLabel = this.i18n.getText(this.treeviewComponent.selection);
    this.selectedChange.emit(values);
    this.hide = !this.hide;
  }

  onFilterChange(text: string): void {
    this.filterChange.emit(text);
  }
}
