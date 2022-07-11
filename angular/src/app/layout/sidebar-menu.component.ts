// tslint:disable
import { Component, Injector, OnInit } from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from '@shared/layout/menu-item';
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = '/app/dashboard';
  testmenu = false;
  items: MegaMenuItem[];

  constructor(injector: Injector,
    private router: Router) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    this.items = [
      // {
      //   label: 'Trang chủ', icon: 'fas fa-home', routerLink: '/app/home'
      // },
      {
        label: this.l('Menu_Dashboard'), icon: 'pi pi-chart-line', routerLink: '/app/dashboard',
      },
      {
        label: this.l('Menu_QuanLyTram'), icon: 'pi pi-home', routerLink: '/app/main/danh-muc/tram',
        visible: this.isGranted('Pages.QuanLyTram')
      },
      {
        label: this.l('Menu_QuanLyCanhBao'), icon: 'fa fa-bullhorn', routerLink: '/app/main/danh-muc/quan-ly-canh-bao',
        visible: this.isGranted('Pages.QuanLyCanhBao')
      },
      {
        label: this.l('Menu_QuanLyLuatCanhBao'), icon: 'pi pi-list', routerLink: '/app/main/danh-muc/bo-canh-bao',
        visible: this.isGranted('Pages.BoCanhBao')
      },
      {
        label: this.l('Menu_QuanLyPhanVung'), icon: 'fas fa-broadcast-tower',
        routerLink: '/app/main/danh-muc/phan-vung',
        visible: this.isGranted('Pages.QuanLyPhanVung')
      },
      {
        label: this.l('Menu_BaoCao'), icon: 'fas fa-clipboard-list',
        visible: this.isGranted('Pages.BaoCao'),
        items: [
          [
            {
              label: '',
              items: [
                {
                  label: this.l('Menu_BaoCaoThongTinTram'),
                  routerLink: '/app/main/danh-muc/bao-cao-thong-tin-tram',
                  visible: this.isGranted('Pages.BaoCaoThongTinTram')
                },
                {
                  label: this.l('Menu_BaoCaoCanhBaoCuaCacTramTrongHeThong'),
                  routerLink: '/app/main/danh-muc/bao-cao-canh-bao-tram',
                  visible: this.isGranted('Pages.BaoCaoCanhBao')
                },
                {
                  label: this.l('Menu_BaoCaoKetQuaGuiVaNhanTinCanhBao'),
                  routerLink: '/app/main/danh-muc/bao-cao-ket-qua-gui-nhan-tin-canh-bao',
                  visible: this.isGranted('Pages.BaoCaoGuiTinNhan')
                },
                {
                  label: this.l('Menu_BaoCaoTrangThaiKetNoiTram'),
                  routerLink: '/app/main/danh-muc/bao-cao-trang-thai-ket-noi-tram',
                  visible: this.isGranted('Pages.BaoCaoTrangThaiKetNoi')
                },
                // {
                //   label: this.l('Menu_BaoCaoNhienLieuMayNo'),
                //   routerLink: '/app/main/danh-muc/bao-cao-nhien-lieu-may-no',
                //   visible: this.isGranted('Pages.BaoCaoNhienLieuMayNo')
                // },
                {
                  label: this.l('Menu_BaoCaoLogHeThong'),
                  routerLink: '/app/main/danh-muc/bao-cao-log-he-thong',
                  visible: this.isGranted('Pages.BaoCaoLog')
                },
                {
                  label: this.l('Menu_BaoCaoDanhSachVaMaCacTramTrongHeThong'),
                  routerLink: '/app/main/danh-muc/bao-cao-danh-sach-va-ma-cac-tram',
                  visible: this.isGranted('Pages.BaoCaoDanhSachVaMaCacTram')
                },
                {
                  label: this.l('bctttram_baocaotrend'),
                  routerLink: '/app/main/danh-muc/bao-cao-thingboard',
                  visible: this.isGranted('Pages.BaoCaoTrend')
                },
                {
                  label: this.l('qlquetthe_logquetthe'),
                  routerLink: '/app/main/danh-muc/log-quet-the',
                  visible: this.isGranted('Pages.LogQuetThe')
                },
              ]
            }
          ]
        ],
      },
      {
        label: this.l('Menu_QuanLyMau'), icon: 'far fa-window-restore', visible: (this.isGranted('Pages.QuanLyMauDieuKhien') || this.isGranted('Pages.QuanLyMauCanhBao')),
        items: [
          [
            {
              label: '',
              items: [
                {
                  label: this.l('Menu_QuanLyMauDieuKhien'),
                  routerLink: '/app/main/danh-muc/mau-dieu-khien',
                  visible: this.isGranted('Pages.QuanLyMauDieuKhien')
                },
                {
                  label: this.l('Menu_QuanLyMauCanhBao'),
                  routerLink: '/app/main/danh-muc/mau-canh-bao',
                  visible: this.isGranted('Pages.QuanLyMauCanhBao')
                },
              ]
            }
          ]
        ],
      },
      {
        label: this.l('Menu_QuanLyDanhMuc'), icon: 'pi pi-th-large', visible: (this.isGranted('Pages.QuanLyDanhMucDuLieuCamBien') || this.isGranted('Pages.QuanLyDanhMucThuocTinh')),
        items: [
          [
            {
              label: '',
              items: [
                {
                  label: this.l('Menu_QuanLyDanhMucTenThuocTinh'),
                  routerLink: '/app/main/danh-muc/mau-thuoc-tinh',
                  visible: this.isGranted('Pages.QuanLyDanhMucThuocTinh')
                },
                {
                  label: this.l('Menu_QuanLyDanhMucTenDuLieuCamBien'),
                  routerLink: '/app/main/danh-muc/mau-du-lieu-cam-bien',
                  visible: this.isGranted('Pages.QuanLyDanhMucDuLieuCamBien')
                },
                {
                  label: this.l('Menu_QuanLyNhanVienRaVaoTram'),
                  routerLink: '/app/main/danh-muc/nhan-vien-ra-vao-tram',
                  visible: this.isGranted('Pages.QuanLyNhanVienRaVaoTram')
                },
                {
                  label: this.l('Menu_QuanLySoDienThoaiVaEmailNhanCanhBao'),
                  routerLink: '/app/main/danh-muc/nguoi-nhan-canh-bao',
                  visible: this.isGranted('Pages.QuanLyNguoiNhanCanhBao')
                },
              ]
            }
          ]
        ],
      },
      {
        label: this.l('Menu_QuanLyHeThong'), icon: 'pi pi-users',
        visible: this.isGrantedAny('Pages.Users', 'Pages.Roles', 'Pages.QuanLyLichSuNguoiDung'),
        items: [
          [
            {
              label: '',
              items: [
                {
                  label: this.l('Menu_QuanLyNguoiDung'),
                  routerLink: '/app/users',
                  visible: this.isGranted('Pages.Users')
                },
                {
                  label: this.l('Menu_QuanLyPhanQuyen'),
                  routerLink: '/app/roles',
                  visible: this.isGranted('Pages.Roles')
                },
                {
                  label: this.l('Menu_LichSuNguoiDung'),
                  routerLink: '/app/auditLogs',
                  visible: this.isGranted('Pages.QuanLyLichSuNguoiDung')
                },
                {
                  label: this.l('Menu_QuanLyThongSoChung'),
                  routerLink: '/app/main/danh-muc/thong-so-chung',
                  visible: this.isGranted('Pages.CauHinhChung')
                }
              ]
            }
          ]
        ],
      },
    ];

    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== '/' ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup = this.router.parseUrl(currentUrl).root
          .children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems('/' + primaryUrlSegmentGroup.toString());
        }
      });
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem(this.l('Menu_Dashboard'), '/app/dashboard', 'pi pi-chart-line'),
      new MenuItem(this.l('Menu_QuanLyTram'), '/app/main/danh-muc/tram', 'pi pi-home', 'Pages.QuanLyTram'),
      new MenuItem(this.l('Menu_QuanLyCanhBao'), '/app/main/danh-muc/quan-ly-canh-bao', 'fa fa-bullhorn', 'Pages.QuanLyCanhBao'),
      new MenuItem(this.l('Menu_QuanLyLuatCanhBao'), '/app/main/danh-muc/bo-canh-bao', 'pi pi-list', 'Pages.BoCanhBao'),
      new MenuItem(this.l('Menu_QuanLyPhanVung'), '/app/main/danh-muc/phan-vung', 'fas fa-broadcast-tower', 'Pages.QuanLyPhanVung'),
      new MenuItem(this.l('Menu_BaoCao'), '', 'fas fa-clipboard-list', 'Pages.BaoCao', [
        new MenuItem(this.l('Menu_BaoCaoThongTinTram'), '/app/main/danh-muc/bao-cao-thong-tin-tram', '', 'Pages.BaoCaoThongTinTram'),
        new MenuItem(this.l('Menu_BaoCaoCanhBaoCuaCacTramTrongHeThong'), '/app/main/danh-muc/bao-cao-canh-bao-tram', '', 'Pages.BaoCaoCanhBao'),
        new MenuItem(this.l('Menu_BaoCaoKetQuaGuiVaNhanTinCanhBao'), '/app/main/danh-muc/bao-cao-ket-qua-gui-nhan-tin-canh-bao', '', 'Pages.BaoCaoGuiTinNhan'),
        new MenuItem(this.l('Menu_BaoCaoTrangThaiKetNoiTram'), '/app/main/danh-muc/bao-cao-trang-thai-ket-noi-tram', '', 'Pages.BaoCaoTrangThaiKetNoi'),
        new MenuItem(this.l('Menu_BaoCaoNhienLieuMayNo'), '/app/main/danh-muc/bao-cao-nhien-lieu-may-no', '', 'Pages.BaoCaoNhienLieuMayNo'),
        new MenuItem(this.l('Menu_BaoCaoLogHeThong'), '/app/main/danh-muc/bao-cao-log-he-thong', '', 'Pages.BaoCaoLog'),
        new MenuItem(this.l('bctttram_baocaotrend'), '/app/main/danh-muc/bao-cao-thingboard', '', 'Pages.BaoCaoTrend'),
        new MenuItem(this.l('qlquetthe_logquetthe'), '/app/main/danh-muc/log-quet-the', '', 'Pages.LogQuetThe'),
      ]),

      new MenuItem(this.l('Menu_QuanLyMau'), '', 'far fa-window-restore', '', [
        new MenuItem(this.l('Menu_QuanLyMauDieuKhien'), '/app/main/danh-muc/mau-dieu-khien', '', 'Pages.QuanLyMauDieuKhien'),
        new MenuItem(this.l('Menu_QuanLyMauCanhBao'), '/app/main/danh-muc/mau-canh-bao', '', 'Pages.QuanLyMauCanhBao'),
      ]),

      new MenuItem(this.l('Menu_QuanLyDanhMuc'), '', 'pi pi-th-large', '', [
        new MenuItem(this.l('Menu_QuanLyDanhMucTenThuocTinh'), '/app/main/danh-muc/mau-thuoc-tinh', '', 'Pages.QuanLyDanhMucThuocTinh'),
        new MenuItem(this.l('Menu_QuanLyDanhMucTenDuLieuCamBien'), '/app/main/danh-muc/mau-du-lieu-cam-bien', '', 'Pages.QuanLyDanhMucDuLieuCamBien'),
        new MenuItem(this.l('Menu_QuanLyNhanVienRaVaoTram'), '/app/main/danh-muc/nhan-vien-ra-vao-tram', '', 'Pages.QuanLyNhanVienRaVaoTram'),
        new MenuItem(this.l('Menu_QuanLySoDienThoaiVaEmailNhanCanhBao'), '/app/main/danh-muc/nguoi-nhan-canh-bao', '', 'Pages.QuanLyNguoiNhanCanhBao'),
      ]),

      new MenuItem(this.l('Menu_QuanLyHeThong'), '', 'pi pi-users', '', [
        new MenuItem(this.l('Menu_QuanLyNguoiDung'), '/app/users', '', 'Pages.Users'),
        new MenuItem(this.l('Menu_QuanLyPhanQuyen'), '/app/roles', '', 'Pages.Roles'),
        new MenuItem(this.l('Menu_LichSuNguoiDung'), '/app/auditLogs', '', 'Pages.QuanLyLichSuNguoiDung'),
        new MenuItem(this.l('Menu_QuanLyThongSoChung'), '/app/main/danh-muc/thong-so-chung', '', 'Pages.CauHinhChung'),
      ]),
    ]
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}
