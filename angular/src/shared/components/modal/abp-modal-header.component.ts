/* tslint:disable */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Injector
} from '@angular/core';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'abp-modal-header',
  templateUrl: './abp-modal-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AbpModalHeaderComponent extends AppComponentBase {
  @Input() title: string;
  @Input() checkButton: boolean;
  @Output() onCloseClick = new EventEmitter<number>();

  sidebarExpanded = false;
  constructor(injector: Injector) {
    super(injector);
  }

  toggleSidebar(): void {
    if (this.sidebarExpanded) {
      this.hideSidebar();
      this.sidebarExpanded = !this.sidebarExpanded;
    } else {
      this.showSidebar();
      this.sidebarExpanded = !this.sidebarExpanded;
    }
  }

  showSidebar(): void {
    $('div[role="document"]').css('max-width', '100%');
  }

  hideSidebar(): void {
    $('div[role="document"]').css('max-width', '1140px');
  }
}
