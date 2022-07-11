// tslint:disable
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import {
  PagedRequestDto
} from 'shared/paged-listing-component-base';
import {
  UserServiceProxy,
  UserDto,
  UserDtoPagedResultDto,
} from '@shared/service-proxies/service-proxies';
import { CreateUserDialogComponent } from './create-user/create-user-dialog.component';
import { EditUserDialogComponent } from './edit-user/edit-user-dialog.component';
import { ResetPasswordDialogComponent } from './reset-password/reset-password.component';
import { AppComponentBase } from '@shared/app-component-base';
import { Table } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';

class PagedUsersRequestDto extends PagedRequestDto {
  keyword: string;
  isActive: boolean | null;
}

@Component({
  templateUrl: './users.component.html',
  animations: [appModuleAnimation()]
})
export class UsersComponent extends AppComponentBase implements OnInit {
  @ViewChild('dt') table: Table;
  users: UserDto[] = [];
  keyword = '';
  isActive: boolean | null;
  advancedFiltersVisible = false;
  loading = true;
  totalCount = 0;
  first = 0;
  listUser: any;
  constructor(
    injector: Injector,
    private _userService: UserServiceProxy,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
  ngOnInit(): void {
  }

  getDataPage(lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._userService
      .getAll(
        this.keyword || undefined,
        this.getSortField(this.table),
        lazyLoad ? lazyLoad.first : this.first,
        lazyLoad ? lazyLoad.rows : this.table.rows,
      ).subscribe((result: UserDtoPagedResultDto) => {
        this._userService.checkUser().subscribe(w => {
          this.listUser = w;
        });
        this.loading = false;
        this.users = result.items;
        this.totalCount = result.totalCount;
      });
  }

  createUser(): void {
    this.showCreateOrEditUserDialog();
  }

  editUser(user: UserDto): void {
    this.showCreateOrEditUserDialog(user.id);
  }

  viewUser(user: UserDto): void {
    this.showCreateOrEditUserDialog(user.id, true);
  }

  updateRole(user: UserDto) {
    this.showCreateOrEditUserDialog(user.id, false, true);
  }

  public resetPassword(user: UserDto): void {
    this.showResetPasswordUserDialog(user.id);
  }

  protected delete(user: UserDto): void {
    if (user.lastLoginTime) {
      this.showExistMessage(this.l('qlnguoidung_swalnguoidungdadangnhapkodcxoa'));
    } else {
      const html1 = '<h3 class="title-popup-xoa m-t-24" >' + this.l('Are You Sure?') + '</h3>' +
        '<p class="text-popup-xoa m-t-8">'
        + this.l('qlnguoidung_swalnguoidung') + user.name + this.l('isdeleted') + '</p>';
      this.swal.fire({
        html: html1,
        icon: 'warning',
        iconHtml: '<span class="icon1">&#9888</span>',
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: this.confirmButtonColor,
        cancelButtonColor: this.cancelButtonColor,
        cancelButtonText: this.l(this.cancelButtonText),
        confirmButtonText: this.l(this.deleteButtonText)
      }).then((result) => {
        if (result.value) {
          this._userService.delete(user.id).subscribe(() => {
            this.showDeleteMessage();
            this.getDataPage();
          });
        }
      });
    }
  }

  private showResetPasswordUserDialog(id?: number): void {
    this._modalService.show(ResetPasswordDialogComponent, {
      class: 'modal-xl',
      initialState: {
        id: id,
      },
    });
  }

  private showCreateOrEditUserDialog(id?: number, isView = false, isRoleActive = false): void {
    let createOrEditUserDialog: BsModalRef;
    if (!id) {
      createOrEditUserDialog = this._modalService.show(
        CreateUserDialogComponent,
        {
          class: 'modal-xl',
        }
      );
    } else {
      createOrEditUserDialog = this._modalService.show(
        EditUserDialogComponent,
        {
          class: 'modal-xl',
          initialState: {
            id: id,
            isView,
            isRoleActive
          },
        }
      );
    }

    createOrEditUserDialog.content.onSave.subscribe(() => {
      this.getDataPage();
    });
  }
}
