import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/app-component-base';
import { AppConsts } from '@shared/AppConsts';
import { CommonComponent } from '@shared/dft/components/common.component';
import { DMThietBiServiceProxy, DMTramServiceProxy, GetListCamera, LookupTableDto, TramDto, TramViewDetailDto } from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import { Table } from 'primeng';
import { loadModules } from 'esri-loader';
import esri = __esri; // Esri TypeScript Types
import { Point } from 'esri/geometry';
// tslint:disable
@Component({
  selector: 'app-tram-thong-tin-chung',
  templateUrl: './tram-thong-tin-chung.component.html',
  styleUrls: ['./tram-thong-tin-chung.component.scss'],
  animations: [appModuleAnimation()],
})
export class TramThongTinChungComponent extends AppComponentBase implements OnInit, OnDestroy {

  @ViewChild('dt') table: Table;
  @Output() onSave = new EventEmitter();
  @Input() idTram: number;
  @Input() tbEntityId: string;
  @ViewChild("mapViewNode", { static: true }) mapViewEl: ElementRef;
  private _view: esri.MapView = null;
  config = {
    animated: false
  };
  hostShinobi: string;
  saving = false;
  form: FormGroup;
  recordTram = new TramViewDetailDto();
  tenTram: string;
  urlList: GetListCamera[] = [];
  private _jsonURL = "../../../../../assets/appconfig.json";
  listCamera = [{ id: 'rTRew7Q8sZQ' }, { id: 'rTRew7Q8sZQ' }];
  a: Point;
  isView = true;
  id: NodeJS.Timeout;
  constructor(
    injector: Injector,
    public http: HttpClient,
    private _router: Router,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _thietBiService: DMThietBiServiceProxy,
    private _tramService: DMTramServiceProxy,

  ) {
    super(injector);
  }

  ngOnInit(): void {
    this._thietBiService.getCameraToList(this.idTram).subscribe(cam => {
      this.urlList = cam;
    });
    this.http.get("../../../../../../assets/appconfig.json").subscribe(w => {
      this.hostShinobi = w["hostShinobi"];

    });
    this.khoiTaoForm();
    this._tramService.getForViewTram(this.idTram, this.isView).subscribe(rs => {
      this.recordTram = rs;
      this.setValueForView(rs);
    });
    this.initializeMap(this.idTram);
    this.form.disable();
    this.getData();
    // reload status after 60s
    this.id = setInterval(() => {
      this.getData();
    }, 30000);
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }

  khoiTaoForm() {
    this.form = this._fb.group({
      MaTram: [''],
      TenTram: [''],
      PhanVung: [''],
      DiaChi: [''],
      ToaDo: [''],
      txtLoaiNguonDien: [],
      GhiChu: [''],
      DeviceId: [''],
      AccessToken: [''],
      TrangThaiKetNoi: [''],
      TrangThaiCanhBao: [''],
    });
  }
  getData() {
    this._tramService.getTrangThaiTuThingsBoard(this.tbEntityId).subscribe(rs => {
      this.form.controls.TrangThaiKetNoi.setValue(rs.trangThaiKetNoi);
      this.form.controls.TrangThaiCanhBao.setValue(rs.trangThaiCanhBao);
    });
  }
  setValueForView(recordTram: TramViewDetailDto) {
    this.form.controls.MaTram.setValue(recordTram.tram.maTram);
    this.form.controls.TenTram.setValue(recordTram.tram.ten);
    const phanVung = new Array();
    this.form.controls.PhanVung.setValue(recordTram.phanVungString);
    this.form.controls.DiaChi.setValue(recordTram.tram.diaChi);
    this.form.controls.ToaDo.setValue(+recordTram.tram.toaDo.x + ', ' + recordTram.tram.toaDo.y);
    this.form.controls.txtLoaiNguonDien.setValue(recordTram.tram.loaiNguonDien);
    this.form.controls.GhiChu.setValue(recordTram.tram.ghiChu);
    // from thingsboard
    this.form.controls.DeviceId.setValue(recordTram.tram.tbEntityId);
    this.form.controls.AccessToken.setValue(recordTram.tram.accessToken);
  }
  close(): void {
    this.form.reset();
  }

  async initializeMap(tramId: number) {
    try {
      let hostNOC = '';
      let hostLink = '';
      $.ajax({
        url: this._jsonURL,
        type: "GET",
        async: false,
        success: function (result_ajax) {
          hostNOC = result_ajax.remoteServiceBaseUrl;
          hostLink = result_ajax.appBaseUrl;
        }
      });
      // Load the modules for the ArcGIS API for JavaScript
      const [EsriMap, EsriMapView, WebTileLayer, FeatureLayer, Graphic, Point, PopupTemplate,] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/WebTileLayer",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/PopupTemplate"
      ]);

      let dsTram;
      $.ajax({
        // url: "http://dev.smartf.dft.vn/mobifone.portal2/api/site",
        url: hostNOC + "/api/services/app/DMTram/GetViewDanhSachTram",
        type: "GET",
        async: false,
        data: { tramId: tramId },
        success: function (result_ajax) {
          dsTram = result_ajax;
        },
        timeout: 5000
      });
      const map = new EsriMap();
      map.removeAll();
      const Tilelayer = new WebTileLayer({
        urlTemplate: "https://image.smartsite.dft.vn/geomap/{level}/{col}/gm_{col}_{row}_{level}.png",
        title: "google",
      });

      map.add(Tilelayer);

      // Initialize the MapView
      const mapViewProperties = new EsriMapView({
        container: this.mapViewEl.nativeElement,
        map: map,
        center: [106.206230, 15.047079],
        zoom: 6,
      });

      const sitename = tramId;
      let long = 0;
      let lat = 0;
      $.ajax({
        url: hostNOC + "/api/services/app/DMTram/GetViewDanhSachTram",
        type: 'GET',
        async: false,
        data: { tramId: sitename },
        timeout: 5000,
        success: function (result) {
          const data = result.result;
          long = data[0].long;
          lat = data[0].lat;
          var pointShow = new Point(data[0].lat, data[0].long);
          const html1 =
            "<a style\=text\-align\:left>" + data[0].tenTram +
            "</a>";
          var template = new PopupTemplate({

            title: html1,
            content: "<br>" +
              "<p style\=text\-align\:left>" + data[0].diaChi + "</p>"
          });
          var ShowGraphic = new Graphic({
            geometry: pointShow,
          });

          const renderer = {
            type: "simple",
            symbol: {
              type: "picture-marker",
              url: "../../../../../../../assets/img/cotsong.png",
              contentType: "image/png",
              width: "60px",
              height: "60px",
            }
          };

          const layer = new FeatureLayer({
            source: [ShowGraphic],  // array of graphics objects
            objectIdField: "OBJECTID",
            popupTemplate: template,
            renderer: renderer,
            minScale: 2000000
          });
          mapViewProperties.center = [data[0].lat, data[0].long];
          mapViewProperties.zoom = 10;
          mapViewProperties.popup.dockEnabled = false;
          const html =
            "<a style\=text\-align\:left data-sitename=\"" + data[0].tenTram + "\" data-pickerSite='" + data.tenTram + "' onclick=\"pickerSite(this)\" data-picker=\".picker-site-info\" class=\"open-picker\">"
            + data[0].tenTram +
            "</a>";
          mapViewProperties.popup.open({
            location: [data[0].lat, data[0].long],
            title: html,
            content:
              "<br>"
              +
              "<p style\=text\-align\:left>"
              + data[0].diaChi +
              "</p>"
          });

          mapViewProperties.popup.dockOptions = {
            buttonEnabled: false,
            breakpoint: false
          };
          mapViewProperties.popup.autoCloseEnabled = false;
          map.add(layer);
        }
      });
      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }
}
