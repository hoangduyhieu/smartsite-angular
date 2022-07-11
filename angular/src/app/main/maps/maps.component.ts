import { Component, Injector, Input } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TramCreateOrEditDialogComponent } from '../danh-muc/tram/create-or-edit/tram-create-or-edit-dialog.component';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
  animations: [appModuleAnimation()],
})
export class MapsComponent extends AppComponentBase {
  constructor(
    injector: Injector,
    private _modalService: BsModalService,
  ) { super(injector); }

  mapCenter = [106.206230, 15.047079];
  basemapType = 'satellite';
  mapZoomLevel = 6;

  // See app.component.html
  mapLoadedEvent(status: boolean) {
  }

  createDemo(id?: number) {
    this._showCreateOrEditDemoDialog(id);
  }

  private _showCreateOrEditDemoDialog(id?: number, isView = false): void {
    // copy
    this._modalService.show(
      TramCreateOrEditDialogComponent,
      {
        class: 'modal-xl',
        ignoreBackdropClick: true,
        initialState: {
          id,
          isView,
        },
      }
    );
  }

}
