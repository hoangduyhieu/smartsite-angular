import { PermissionTreeComponent } from './dft/components/permission-tree.component';
import { NormalizeDropdownPositionDirective } from './directives/normalize-dropdown-position.directive';
import { ButtonBusyDirective } from './dft/directives/button-busy.directive';
import { DecimalDirective } from './dft/directives/decimal-only.directive';
import { NumberDirective } from './dft/directives/number-only.directive';
import { DisableControlDirective } from './dft/directives/disable-control.directive';
import { PhoneNumberDirective } from './dft/directives/phone-number.directive';
import { TienTePipe } from './dft/directives/tiente.pipe';
import { LabelValidationComponent } from './dft/components/lable-validate.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppSessionService } from './session/app-session.service';
import { AppUrlService } from './nav/app-url.service';
import { AppAuthService } from './auth/app-auth.service';
import { AppRouteGuard } from './auth/auth-route-guard';
import { LocalizePipe } from '@shared/pipes/localize.pipe';
import { ChangeType } from '@shared/pipes/changeType.pipe';
import { PipeStatus } from '@shared/pipes/pipeStatus.pipe';
import { ValidationComponent } from './dft/components/validation-messages.component';
import { AbpPaginationControlsComponent } from './components/pagination/abp-pagination-controls.component';
import { AbpValidationSummaryComponent } from './components/validation/abp-validation.summary.component';
import { AbpModalHeaderComponent } from './components/modal/abp-modal-header.component';
import { AbpModalFooterComponent } from './components/modal/abp-modal-footer.component';
import { LayoutStoreService } from './layout/layout-store.service';
import { BusyDirective } from './directives/busy.directive';
import { EqualValidator } from './directives/equal-validator.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { PhanVungTreeCheckBoxComponent } from './dft/components/phanvung-tree-checkbox.component';
// ng-face
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MegaMenuModule } from 'primeng/megamenu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToastModule } from 'primeng/toast';
import { TreeTableModule } from 'primeng/treetable';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FieldsetModule } from 'primeng/fieldset';
import { EditorModule } from 'primeng/editor';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FileDownloadService } from './file-download.service';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AccordionModule } from 'primeng/accordion';
import { ImportExcelDialogComponent } from './components/import-excel/import-excel-dialog.component';
import { TooltipModule } from 'primeng/tooltip';
import { TruncatePipe } from './dft/pipes/truncate.pipe';
import {PickListModule} from 'primeng/picklist';
import { DropdownTreeviewSelectComponent } from './dft/dropdown-treeview-select/dropdown-treeview-select.component';
import { DisabledOnSelectorDirective } from './dft/dropdown-treeview-select/disabled-on-selector.directive';
import { TreeviewModule } from './dft/dropdown-treeview-select/lib/treeview.module';
import {TabViewModule} from 'primeng/tabview';
import { MultipleSelectTreeComponent } from './dft/multiple-select-tree/multiple-select-tree.component';
import { MultiSelectCheckBoxTreeComponent } from './dft/multi-select-checkbox-tree/multi-select-checkbox-tree.component';
import { TreesViewComponent } from './dft/trees-view/trees-view.component';
import { EsriMapComponent } from '@app/main/maps/esri-map/esri-map.component';
import { MapsComponent } from '@app/main/maps/maps.component';
import { ReplaceSpacePipe } from './dft/pipes/replace-space.pipe';
import { SafePipe } from './dft/pipes/safe.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SpinnerModule } from 'primeng/spinner';
import { GaugesModule } from '@biacsics/ng-canvas-gauges';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import {ChartModule} from 'primeng/chart';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ViewQuanLyCanhBaoComponent } from '@app/main/danh-muc/quan-ly-canh-bao/view-detail-dm-canh-bao/view-quan-ly-canh-bao/view-quan-ly-canh-bao.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { InlineSVGModule } from 'ng-inline-svg';
@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        NgxPaginationModule,
        NgxDropzoneModule,
        // ng-face
        CheckboxModule,
        DropdownModule,
        SplitButtonModule,
        MegaMenuModule,
        ToastModule,
        ButtonModule,
        TableModule,
        MultiSelectModule,
        CalendarModule,
        ProgressBarModule,
        TieredMenuModule,
        DialogModule,
        MessageModule,
        InputTextModule,
        TreeTableModule,
        FormsModule,
        TabsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        FieldsetModule,
        EditorModule,
        InputMaskModule,
        InputSwitchModule,
        InputNumberModule,
        SliderModule,
        BsDropdownModule,
        RadioButtonModule,
        AccordionModule,
        TooltipModule,
        PickListModule,
        TreeviewModule.forRoot(),
        TabViewModule,
        GaugesModule,
        SelectButtonModule,
        SpinnerModule,
        ProgressSpinnerModule,
        BlockUIModule,
        ConfirmDialogModule,
        ChartModule,
        NgApexchartsModule,
        InlineSVGModule
    ],
    declarations: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        ButtonBusyDirective,
        NormalizeDropdownPositionDirective,
        EqualValidator,
        NumberDirective,
        DisableControlDirective,
        DecimalDirective,
        PhoneNumberDirective,

        // component
        ValidationComponent,
        LabelValidationComponent,
        ImportExcelDialogComponent,
        MultipleSelectTreeComponent,
        PermissionTreeComponent,
        MultipleSelectTreeComponent,
        DisabledOnSelectorDirective,
        TreesViewComponent,
        PhanVungTreeCheckBoxComponent,
        MultiSelectCheckBoxTreeComponent,
        // Pipe
        TienTePipe,
        ChangeType,
        PipeStatus,
        TruncatePipe,
        ReplaceSpacePipe,

        TreesViewComponent,
        MapsComponent,
        EsriMapComponent,
        DropdownTreeviewSelectComponent,
        ReplaceSpacePipe,
        SafePipe,
        ViewQuanLyCanhBaoComponent,
        CreateUserDialogComponent,
    ],
    exports: [
        AbpPaginationControlsComponent,
        AbpValidationSummaryComponent,
        AbpModalHeaderComponent,
        AbpModalFooterComponent,
        LocalizePipe,
        BusyDirective,
        EqualValidator,
        ImportExcelDialogComponent,
        // module
        NgxDropzoneModule,

        // component
        ValidationComponent,
        LabelValidationComponent,
        PermissionTreeComponent,
        MultipleSelectTreeComponent,
        TreesViewComponent,
        PhanVungTreeCheckBoxComponent,
        MultiSelectCheckBoxTreeComponent,
        // ng-face
        FieldsetModule,
        CheckboxModule,
        DropdownModule,
        SplitButtonModule,
        MegaMenuModule,
        ToastModule,
        ButtonModule,
        TableModule,
        MultiSelectModule,
        CalendarModule,
        ProgressBarModule,
        TieredMenuModule,
        DialogModule,
        MessageModule,
        InputTextModule,
        TreeTableModule,
        FormsModule,
        CommonModule,
        TabsModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        InputSwitchModule,
        InputNumberModule,
        SliderModule,
        BsDropdownModule,
        RadioButtonModule,
        ButtonBusyDirective,
        NumberDirective,
        DisableControlDirective,
        DecimalDirective,
        PhoneNumberDirective,
        NormalizeDropdownPositionDirective,
        AccordionModule,
        TooltipModule,
        PickListModule,
        TreeviewModule,
        TabViewModule,
        GaugesModule,
        SelectButtonModule,
        SpinnerModule,
        ProgressSpinnerModule,
        BlockUIModule,
        ConfirmDialogModule,
        ChartModule,
        NgApexchartsModule,
        InlineSVGModule,

        // Pipe
        TruncatePipe,
        ReplaceSpacePipe,
        MapsComponent,
        EsriMapComponent,
        DropdownTreeviewSelectComponent,
        DisabledOnSelectorDirective,
        TienTePipe,
        SafePipe,
        ChangeType,
        PipeStatus,
        ViewQuanLyCanhBaoComponent,
        CreateUserDialogComponent,
    ],
    providers: [
        FileDownloadService
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService,
                AppUrlService,
                AppAuthService,
                AppRouteGuard,
                LayoutStoreService
            ]
        };
    }
}
