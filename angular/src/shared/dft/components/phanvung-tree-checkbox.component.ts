import { FlatTreeSelectDto } from '../../service-proxies/service-proxies';
import { AppComponentBase } from '@shared/app-component-base';
/* tslint:disable */
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Injector, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MultiSelectTree, PermissionTreeEditModel } from './permission-tree-edit.model';
import * as _ from 'lodash';
import { Theme } from '@fullcalendar/common';

@Component({
    selector: 'app-phanvung-tree-checkbox',
    template: `
            <div class="phanvung-tree-checkbox"></div>
   `
})
export class PhanVungTreeCheckBoxComponent extends AppComponentBase implements OnInit, AfterViewInit, AfterViewChecked {

    @Output() onSelectedChange = new EventEmitter<FlatTreeSelectDto[]>();

    set editData(val: MultiSelectTree) {
        this._editData = val;
        this.refreshTree();
    }
    permissionNames: FlatTreeSelectDto[] = [];

    private _$tree: JQuery;
    private _editData: MultiSelectTree;
    private _createdTreeBefore;
    constructor(private _element: ElementRef,
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this._$tree = $(this._element.nativeElement);

        this._$tree.on('select_node.jstree', function (e, data) {
            if (data.event) { data.instance.select_node(data.node.children_d); }
        }).on('deselect_node.jstree', function (e, data) {
            if (data.event) {
                data.instance.deselect_node(data.node.children_d);
            }
        });

        this.refreshTree();
    }

    ngAfterViewChecked(): void {

    }

    getGrantedPermissionNames(): FlatTreeSelectDto[] {
        if (!this._$tree || !this._createdTreeBefore) {
            return [];
        }

        this.permissionNames = [];
        let selectedPermissions = this._$tree.jstree('get_selected', true);
        for (let i = 0; i < selectedPermissions.length; i++) {
            let rootOfElement = this._editData.data.find(e => e.id == selectedPermissions[i].original.id)?.rootParentId;
            let isLevel = this._editData.data.find(e => e.id == selectedPermissions[i].original.id)?.isLowestLevel;
            this.permissionNames.push(new FlatTreeSelectDto({
                id: selectedPermissions[i].original.id,
                parentId: selectedPermissions[i].original.parent,
                displayName: selectedPermissions[i].original.text,
                isLowestLevel: isLevel,
                rootParentId: rootOfElement
            }));
        }
        this.onSelectedChange.emit(this.permissionNames)
        this.reloadTree();
        return this.permissionNames;
    }

    refreshTree(): void {
        let self = this;

        if (this._createdTreeBefore) {
            this._$tree.jstree('destroy');
        }

        this._createdTreeBefore = false;

        if (!this._editData || !this._$tree) {
            return;
        }

        let treeData = _.map(this._editData.data, function (item) {
            return {
                id: item.id,
                parent: item.parentId ? item.parentId : '#',
                text: item.displayName,
                state: {
                    opened: false,
                    selected: _.includes(self._editData.selectedData, item.id),
                    disabled: !item.isLowestLevel,
                }
            };
        });

        this._$tree.jstree({
            'core': {
                data: treeData,
                "themes": {
                    "icons": false
                }
            },
            'types': {
                'default': {
                    'icon': 'fas fa-folder m--font-warning'
                },
                'file': {
                    'icon': 'fa fa-file m--font-warning'
                }
            },
            'checkbox': {
                keep_selected_style: false,
                three_state: false,
                cascade: ''
            },
            plugins: ['checkbox', 'types']
        });

        this._createdTreeBefore = true;

        let inTreeChangeEvent = false;

        function selectNodeAndAllParents(node) {
            self._$tree.jstree('select_node', node, true);
            let parent = self._$tree.jstree('get_parent', node);
            if (parent) {
                selectNodeAndAllParents(parent);
            }
        }


        this._$tree.on('changed.jstree', function (e, data) {
            self.getGrantedPermissionNames();
            if (!data.node || !inTreeChangeEvent) {
                return;
            }
            let wasInTreeChangeEvent = inTreeChangeEvent;
            if (!wasInTreeChangeEvent) {
                inTreeChangeEvent = true;
            }

            let childrenNodes;

            if (data.node.state.selected) {
                selectNodeAndAllParents(self._$tree.jstree('get_parent', data.node));
                childrenNodes = $.makeArray(self._$tree.jstree('get_children_dom', data.node));
                self._$tree.jstree('select_node', childrenNodes);

            } else {
                childrenNodes = $.makeArray(self._$tree.jstree('get_children_dom', data.node));
                self._$tree.jstree('deselect_node', childrenNodes);
            }

            if (!wasInTreeChangeEvent) {
                inTreeChangeEvent = false;
            }
        });
    }

    reloadTree(): void {
        let self = this;
        function changeStatus(node_id, changeTo) {
            var node = self._$tree.jstree().get_node(node_id);
            if (changeTo === 'enable') {
                self._$tree.jstree().enable_node(node);
            } else {
                self._$tree.jstree().disable_node(node);
            }
        }

        let listRoot = this.permissionNames.map(e => e.rootParentId);
        let listSelected = this.permissionNames.map(e => e.id);
        self._editData.selectedData = listSelected;
        this._editData.data?.filter(e => e.isLowestLevel === true).forEach(e => {
            if (listRoot.includes(e.rootParentId) && !listSelected.includes(e.id)) {
                changeStatus(e.id, "disable");
            } else {
                changeStatus(e.id, "enable");
            }
        });
    }
}
