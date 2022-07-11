// tslint:disable
import { finalize } from 'rxjs/operators';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedListingComponentBase,
  PagedRequestDto
} from '@shared/paged-listing-component-base';
import {
  RoleServiceProxy,
  RoleDto,
  RoleDtoPagedResultDto
} from '@shared/service-proxies/service-proxies';
import { CreateRoleDialogComponent } from './create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './edit-role/edit-role-dialog.component';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { AppComponentBase } from '@shared/app-component-base';

class PagedRolesRequestDto extends PagedRequestDto {
  keyword: string;
}

@Component({
  templateUrl: './roles.component.html',
  animations: [appModuleAnimation()]
})
export class RolesComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  roles: RoleDto[] = [];
  keyword = '';
  loading = false;
  totalCount = 0;
  listRoles: any;
  constructor(
    injector: Injector,
    private _rolesService: RoleServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
  ngOnInit(): void {
  }

  getDataPage(isSearch: boolean, lazyLoad?: LazyLoadEvent) {
    this._rolesService
      .getAll(
        this.keyword || undefined,
        isSearch,
        this.getSortField(this.table),
        lazyLoad ? lazyLoad.first : this.table.first,
        lazyLoad ? lazyLoad.rows : this.table.rows,
      ).subscribe((result: RoleDtoPagedResultDto) => {
        this._rolesService.checkRoles().subscribe(w => {
          this.listRoles = w;
        });
        this.loading = false;
        this.roles = result.items;
        this.totalCount = result.totalCount;
      });
  }

  delete(role: RoleDto): void {
    this.swal.fire({
      title: this.l('Are You Sure?'),
      text: 'Vai trò ' + role.displayName + ' sẽ bị xóa.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: this.confirmButtonColor,
      cancelButtonColor: this.cancelButtonColor,
      cancelButtonText: this.l(this.cancelButtonText),
      confirmButtonText: this.l(this.confirmButtonText)
    }).then((result) => {
      if (result.value) {
        this._rolesService
          .delete(role.id)
          .pipe(
            finalize(() => {
              this.showDeleteMessage();
              this.getDataPage(false);
            })
          )
          .subscribe(() => { });
      }
    });

  }

  createRole(): void {
    this.showCreateOrEditRoleDialog();
  }

  editRole(role: RoleDto, isPermissionActive = false): void {
    this.showCreateOrEditRoleDialog(role.id, isPermissionActive);
  }

  showCreateOrEditRoleDialog(id?: number, isPermissionActive = false): void {
    let createOrEditRoleDialog: BsModalRef;
    if (!id) {
      createOrEditRoleDialog = this._modalService.show(
        CreateRoleDialogComponent,
        {
          class: 'modal-xl',
        }
      );
    } else {
      createOrEditRoleDialog = this._modalService.show(
        EditRoleDialogComponent,
        {
          class: 'modal-xl',
          initialState: {
            id: id,
            isPermissionActive
          },
        }
      );
    }

    createOrEditRoleDialog.content.onSave.subscribe(() => {
      this.getDataPage(false);
    });
  }
}