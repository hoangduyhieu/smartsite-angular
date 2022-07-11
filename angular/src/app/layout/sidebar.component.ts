import { AppComponentBase } from '@shared/app-component-base';
// tslint:disable
import {
  Component,
  ChangeDetectionStrategy,
  Renderer2,
  OnInit,
  Injector
} from '@angular/core';
import { LayoutStoreService } from '@shared/layout/layout-store.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent extends AppComponentBase implements OnInit {
  sidebarExpanded: boolean;
  isMobile = false;
  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private _layoutStore: LayoutStoreService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._layoutStore.sidebarExpanded.subscribe((value) => {
      this.sidebarExpanded = value;
      this.toggleSidebar();
    });
  }

  toggleSidebar(): void {
    if (this.sidebarExpanded) {
      this.hideSidebar();
    } else {
      this.showSidebar();
    }
  }

  showSidebar(): void {
    this.renderer.addClass(document.body, 'sidebar-open');
    $('.content-wrapper').addClass('menu-mobile-256');
    $('.content-wrapper').removeClass('m-l-0');
    $('.main-header').removeClass('m-l-0');
    $('.main-header').addClass('menu-mobile-268');
    $('.main-footer').addClass('menu-mobile-268');
    $('.main-footer').removeClass('m-l-0');
    $('.main-sidebar').removeClass('visibility-hidden');
    $('.main-sidebar').addClass('bg-transparent');
  }

  hideSidebar(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    $('.content-wrapper').removeClass('menu-mobile-256');
    $('.content-wrapper').addClass('m-l-0');
    $('.main-header').removeClass('menu-mobile-268');
    $('.main-header').addClass('m-l-0');
    $('.main-footer').removeClass('menu-mobile-268');
    $('.main-footer').addClass('m-l-0');
    $('.main-sidebar').addClass('visibility-hidden');
  }
}
