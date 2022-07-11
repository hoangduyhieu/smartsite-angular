import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { CommonComponent } from '@shared/dft/components/common.component';
import { FileDownloadService } from '@shared/file-download.service';
import { AuditLogListDto, AuditLogServiceProxy, GetAuditLogsInput, StringLookupTableDto } from '@shared/service-proxies/service-proxies';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LazyLoadEvent } from 'primeng';
import { Table } from 'primeng/table';
import { CreateUserDialogComponent } from '../create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user/edit-user-dialog.component';

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.scss'],
  animations: [appModuleAnimation()]
})
export class AuditLogsComponent extends AppComponentBase implements OnInit {

  @ViewChild('dt') table: Table;
  public usernameAuditLog: string;
  public serviceName: StringLookupTableDto;
  totalCount = 0;
  primengTableHelperAuditLogs: AuditLogListDto[] = [];
  advancedFiltersAreShown = false;
  loading = true;
  exporting = false;
  isView = true;
  keyword = '';
  input: GetAuditLogsInput;
  arrService: StringLookupTableDto[] = [];
  rangeDates: any[] = [];

  constructor(
    injector: Injector,
    private _auditLogService: AuditLogServiceProxy,
    private _fileDownloadService: FileDownloadService,
    private _modalService: BsModalService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    this.rangeDates[0] = CommonComponent.getNgayDauTienCuaThangHienTaiDate();
    this.rangeDates[1] = new Date();

    this._auditLogService.getAllServiceName().subscribe(res => {
      this.arrService = res;
    });
  }

  getAuditLogs(isSearch: boolean, lazyLoad?: LazyLoadEvent) {
    this.loading = true;
    this._auditLogService.getAllAuditLogs(
      this.rangeDates ? this.rangeDates[0] : undefined,
      this.rangeDates ? this.rangeDates[1] : undefined,
      this.usernameAuditLog || undefined,
      this.serviceName ? this.serviceName.id : undefined,
      isSearch,
      this.getSortField(this.table),
      lazyLoad ? lazyLoad.first : this.table.first,
      lazyLoad ? lazyLoad.rows : this.table.rows,
      this.isView
    ).subscribe((result) => {
      this.loading = false;
      this.totalCount = result.totalCount;
      this.primengTableHelperAuditLogs = result.items;
    });
  }

  exportToExcelAuditLogs(): void {

    const self = this;
    self.exporting = true;
    this.input = new GetAuditLogsInput();
    this.input.startDate = this.rangeDates ? this.rangeDates[0] : undefined;
    this.input.endDate = this.rangeDates ? this.rangeDates[1] : undefined;
    this.input.userName = this.usernameAuditLog || undefined;
    this.input.serviceName = this.serviceName ? this.serviceName.id : undefined;
    this.input.sorting = this.getSortField(this.table);
    this.input.skipCount = 0;
    this.input.maxResultCount = 10000000;
    this.input.startDate = this.rangeDates ? this.rangeDates[0] : undefined;
    this.input.endDate = this.rangeDates ? this.rangeDates[1] : undefined;
    self._auditLogService.exportToExcel(this.input)
      .subscribe(result => {
        self._fileDownloadService.downloadTempFile(result);
        self.exporting = false;
      });
  }

  truncateStringWithPostfix(text: string, length: number): string {
    return abp.utils.truncateStringWithPostfix(text, length);
  }

  viewUser(user: number): void {
    this._showCreateOrEditUserDialog(user, true);
  }

  private _showCreateOrEditUserDialog(id: number, isView = false, isRoleActive = false): void {
    let createOrEditUserDialog: BsModalRef;
    createOrEditUserDialog = this._modalService.show(
      EditUserDialogComponent,
      {
        class: 'modal-xl',
        initialState: {
          id,
          isView,
          isRoleActive
        },
      }
    );

    createOrEditUserDialog.content.onSave.subscribe(() => {
    });
  }
}
