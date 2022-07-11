/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
// tslint:disable
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  Injector
} from "@angular/core";
import { loadModules } from "esri-loader";
import esri = __esri; // Esri TypeScript Types
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import * as $ from "jquery";
import { appModuleAnimation } from "@shared/animations/routerTransition";
import { AppConsts } from "@shared/AppConsts";
import { AppComponentBase } from "@shared/app-component-base";

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"],
  animations: [appModuleAnimation()],
})
export class EsriMapComponent extends AppComponentBase implements OnInit, OnDestroy {
  @Output() mapLoadedEvent = new EventEmitter<boolean>();

  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  private _zoom = 10;
  private _center: Array<number> = [106.206230, 15.047079];
  private _basemap = "";
  private _loaded = false;
  private _view: esri.MapView = null;

  private _jsonURL = "./assets/appconfig.json";


  dataJsonLink: any;
  dataTram: any;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  constructor(
    injector: Injector,
    public http: HttpClient,

  ) {
    super(injector);
    this.getJSON().subscribe(data => {
      this.dataJsonLink = data;
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  async initializeMap() {
    try {
      let listAdd = [];
      let listRemove = [];
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
      const [EsriMap, EsriMapView, WebTileLayer, GraphicsLayer, webMercatorUtils, PictureMarkerSymbol, Graphic, Point, PopupTemplate, SearchSource, geometryEngine, esriRequest, Search] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/WebTileLayer",
        "esri/layers/GraphicsLayer",
        "esri/geometry/support/webMercatorUtils",
        "esri/symbols/PictureMarkerSymbol",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/PopupTemplate",
        "esri/widgets/Search/SearchSource",
        "esri/geometry/geometryEngine",
        "esri/request",
        "esri/widgets/Search",
      ]);
      let dsTram;
      $.ajax({
        // url: "http://dev.smartf.dft.vn/mobifone.portal2/api/site",
        url: hostNOC + "/api/services/app/DMTram/GetAllDanhSachTram",
        type: "GET",
        async: false,
        data: {
          userId: abp.session.userId,
        },
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

      const gl = new GraphicsLayer({
        id: "my-gl",
        minScale: 2000000
      });

      const gl_search = new GraphicsLayer({
        id: "search"
      });
      map.addMany([gl, gl_search]);
      // Initialize the MapView
      const mapViewProperties = new EsriMapView({
        container: this.mapViewEl.nativeElement,
        map: map,
        center: [106.206230, 15.047079],
        zoom: 6,
      });

      var getSite = function (data) {
        data.userId = abp.session.userId;
        var result;
        $.ajax({
          url: hostNOC + "/api/services/app/DMTram/GetAllDanhSachTram",
          type: 'GET',
          async: false,
          data: data,
          timeout: 5000,
          success: function (result_ajax) {
            result = result_ajax;
          }
        });
        return result;
      }


      var customSearchSource = new SearchSource({
        placeholder: this.l("map_nhaptentram"),
        name: this.l("map_tentram"),
        locationEnabled: false,
        // Provide a getSuggestions method
        // to provide suggestions to the Search widget
        getSuggestions: function (params) {
          // You can request data from a
          // third-party source to find some
          // suggestions with provided suggestTerm
          // the user types in the Search widget
          return esriRequest(hostNOC + "/api/services/app/DMTram/GetAllSuggestion", {

            query: {
              ten: params.suggestTerm.replace(/ /g, "+"),
              // ten: "t",
              limit: 6,
              lat: mapViewProperties.center.latitude,
              lon: mapViewProperties.center.longitude,
              userId: abp.session.userId
            },
            responseType: "json",
          }).then(function (results) {
            // Return Suggestion results to display
            // in the Search widget
            return results.data.result.features.map(function (feature) {
              return {
                key: "name",
                text: feature.properties.label,
                sourceIndex: params.sourceIndex
              };
            });
          });
        },
        // Provide a getResults method to find
        // results from the suggestions
        getResults: function (params) {
          console.log("params", params.location);


          // If the Search widget passes the current location,
          // you can use this in your own custom source
          var query = { lat: undefined, lon: undefined, ten: undefined, limit: 6 };
          // You can perform a different query if a location
          // is provided
          if (params.location) {
            query.lat = params.location.latitude;
            query.lon = params.location.longitude;
          } else {
            query.ten = params.suggestResult.text;
            query.limit = 6;
          }
          return esriRequest(hostNOC + "/api/services/app/DMTram/GetAllSuggestionSearch", {
            query: query,
            responseType: "json"
          }).then(function (results) {
            // Parse the results of your custom search
            var searchResults = results.data.result.features.map(function (feature) {
              // Create a Graphic the Search widget can display
              const lat = feature.geometry.coordinates[0];
              const lon = feature.geometry.coordinates[1];
              const point = {
                type: "point",
                longitude: lon,
                latitude: lat
              };

              var graphic = new Graphic({
                geometry: point,
                attributes: feature.properties
              });
              // Optionally, you can provide an extent for
              // a point result, so the view can zoom to it
              var buffer = geometryEngine.geodesicBuffer(
                graphic.geometry,
                1000,
                "meters"
              );
              // Return a Search Result
              var searchResult = {
                extent: buffer.extent,
                feature: graphic,
                name: feature.properties.label,
              };
              return searchResult;
            });

            // Return an array of Search Results
            return searchResults;

          });
        }
      });

      var customSearchSourceLocation = new SearchSource({
        placeholder: this.l('map_nhaptoado'),
        name: this.l('map_toado'),
        locationEnabled: false,
        // Provide a getSuggestions method
        // to provide suggestions to the Search widget
        getSuggestions: function (params) {
          // You can request data from a
          // third-party source to find some
          // suggestions with provided suggestTerm
          // the user types in the Search widget
          var str = params.suggestTerm.replace(/ /g, "");
          var toaDo = str.split(",", 2);
          let toaDoX = undefined;
          let toaDoY = undefined;
          if (toaDo.length == 1) {
            toaDoX = +toaDo[0];
          }
          if (toaDo.length == 2) {
            toaDoY = +toaDo[1];
          }
          return esriRequest(hostNOC + "/api/services/app/DMTram/GetAllSuggestionLocation", {
            query: {
              ten: params.suggestTerm.replace(/ /g, "+"),
              // ten: "t",
              limit: 6,
              lat: toaDoX,
              lon: toaDoY,
              userId: abp.session.userId
            },
            responseType: "json",
          }).then(function (results) {
            // Return Suggestion results to display
            // in the Search widget
            return results.data.result.features.map(function (feature) {
              return {
                key: "name",
                text: feature.properties.label,
                sourceIndex: params.sourceIndex
              };
            });
          });
        },
        // Provide a getResults method to find
        // results from the suggestions
        getResults: function (params) {
          // If the Search widget passes the current location,
          // you can use this in your own custom source
          var query = { lat: undefined, lon: undefined, ten: undefined, limit: 6 };
          // You can perform a different query if a location
          // is provided
          let searchStr = params.suggestResult.text.split(", ", 2);
          query.lat = +searchStr[0];
          query.lon = +searchStr[1];
          query.limit = 6;
          return esriRequest(hostNOC + "/api/services/app/DMTram/GetAllSuggestionSearchLocation", {
            query: query,
            responseType: "json"
          }).then(function (results) {
            // Parse the results of your custom search
            var searchResults = results.data.result.features.map(function (feature) {
              // Create a Graphic the Search widget can display
              const lat = feature.geometry.coordinates[0];
              const lon = feature.geometry.coordinates[1];
              const point = {
                type: "point",
                longitude: lon,
                latitude: lat
              };

              var graphic = new Graphic({
                geometry: point,
                attributes: feature.properties
              });
              // Optionally, you can provide an extent for
              // a point result, so the view can zoom to it
              var buffer = geometryEngine.geodesicBuffer(
                graphic.geometry,
                300,
                "meters"
              );
              // Return a Search Result
              var searchResult = {
                extent: buffer.extent,
                feature: graphic,
                name: feature.properties.label,
              };
              return searchResult;
            });

            // Return an array of Search Results
            return searchResults;

          });
        }
      });

      var searchWidget = new Search({
        view: mapViewProperties,
        searchAllEnabled: false,
        allPlaceholder: this.l('Search'),
        popupEnabled: true,
        sources: [customSearchSource,
          customSearchSourceLocation],
        includeDefaultSources: false
      });

      mapViewProperties.ui.add(searchWidget, {
        position: "top-right"
      });

      const [Home, Locate, watchUtils,] = await loadModules([
        "esri/widgets/Home",
        "esri/widgets/Locate",
        "esri/core/watchUtils"
      ]);
      const homeWidget = new Home({
        view: mapViewProperties
      });
      mapViewProperties.ui.add(homeWidget, "top-left");

      // kết thúc for

      const locateWidget = new Locate({
        view: mapViewProperties,
        graphicsLayer: gl,
        goToLocationEnabled: false,
        geolocationOptions: {
          timeout: 60000,
          enableHighAccuracy: false,
          maximumAge: 60000
        }
      });
      function geoResults(position) {
        console.log(position);
      }

      function geoErrors(error) {
        console.log(error);
      }
      navigator.geolocation.watchPosition(
        geoResults,
        geoErrors,
        {
          timeout: 60000,
          enableHighAccuracy: false,
          maximumAge: 60000
        }
      );

      // locateWidget.start();
      // mapViewProperties.ui.add(locateWidget, "top-right");
      locateWidget.on("locate", function (geoProcess) {
        mapViewProperties.center = [geoProcess.position.coords.longitude, geoProcess.position.coords.latitude];
        mapViewProperties.zoom = 15;
      });

      let OldGraphicList = [];
      watchUtils.whenTrue(mapViewProperties, "stationary", function () {
        if (mapViewProperties.extent) {
          const gl = map.findLayerById("my-gl");
          if (mapViewProperties.zoom >= 6) {
            gl.removeAll();
            const XminYmin = webMercatorUtils.xyToLngLat(mapViewProperties.extent.xmin, mapViewProperties.extent.ymin);
            const XmaxYmax = webMercatorUtils.xyToLngLat(mapViewProperties.extent.xmax, mapViewProperties.extent.ymax);

            const xmin = XminYmin[0].toFixed(3);
            const ymin = XminYmin[1].toFixed(3);
            const xmax = XmaxYmax[0].toFixed(3);
            const ymax = XmaxYmax[1].toFixed(3);
            // let result: any;
            const params = {
              ymin: ymin,
              xmin: xmin,
              ymax: ymax,
              xmax: xmax,
              sitenumber: "500",
            };
            dsTram = getSite(params);

            const symbol2G = new PictureMarkerSymbol({
              url: "../assets/img/cotsong.png",
              height: "60px",
              width: "60px"
            });

            if (dsTram) {
              var symbol;
              var GraphicList = [];
              var site = {};
              for (var i in dsTram.result) {
                symbol = symbol2G;
                site = dsTram.result[i].tenTram;
                var point = new Point(dsTram.result[i].lat, dsTram.result[i].long);
                const link = hostLink + "/app/main/danh-muc/tram/tram-view-detail/" + dsTram.result[i].tramId + "/" + dsTram.result[i].tbTramId + "/0";
                const html1 =
                  "<a href=\"" + link + "\">" + site +
                  "</a>";
                "<a href=\"" + link + "\" data-sitename=\"" + dsTram.result[i].tenTram + "\" data-pickerSite='" + dsTram.result[i].tenTram + "' onclick=\"pickerSite(this)\" data-picker=\".picker-site-info\" class=\"open-picker\">"
                var template = new PopupTemplate({

                  title: html1,
                  content: dsTram.result[i].diaChi,
                });
                var graphic = new Graphic({
                  geometry: point,
                  symbol: symbol,
                  attributes: { type: 'Site' },
                  popupTemplate: template
                });
                GraphicList.push(graphic);
              }
              var addGraphicList = [];
              for (var i in GraphicList) {
                var newGraphic = GraphicList[i];
                var found = false;
                for (var j in OldGraphicList) {
                  var oldGraphic = OldGraphicList[j];
                  if ((oldGraphic.Site + oldGraphic.Type) == (newGraphic.Site + newGraphic.Type)) {
                    found = true;
                    break;
                  }
                }

                if (!found) {
                  addGraphicList.push(newGraphic);
                }
              }
              var removeGraphicList = [];
              for (var i in OldGraphicList) {
                var oldGraphic = OldGraphicList[i];
                var found = false;
                for (var j in GraphicList) {
                  var newGraphic = GraphicList[j];
                  if ((oldGraphic.Site + oldGraphic.Type) == (newGraphic.Site + newGraphic.Type)) {
                    found = true;
                    break;
                  }
                }

                if (!found) {
                  removeGraphicList.push(oldGraphic);
                }
              }

              var addGraphicList = [];
              for (var i in GraphicList) {
                var newGraphic = GraphicList[i];
                var found = false;
                for (var j in OldGraphicList) {
                  var oldGraphic = OldGraphicList[j];
                  if ((oldGraphic.Site + oldGraphic.Type) == (newGraphic.Site + newGraphic.Type)) {
                    found = true;
                    break;
                  }
                }

                if (!found) {
                  addGraphicList.push(newGraphic);
                }
              }
              listRemove = removeGraphicList;
              listAdd = addGraphicList;
              gl.removeMany(removeGraphicList);
              gl.addMany(addGraphicList);

              OldGraphicList = [];
              for (var i in GraphicList) {
                OldGraphicList.push(GraphicList[i]);
              }
            }
          }
        }
      });

      var hightlight = null;
      mapViewProperties.on("pointer-move", function (event) {
        mapViewProperties.hitTest(event).then(function (response) {
          if (response.results.length) {
            let graphic = response.results.filter(function (result) {
              return result.graphic.layer === gl;
            })[0].graphic;
            mapViewProperties.whenLayerView(graphic.layer).then(function (layerView) {
              hightlight = layerView.highlight(graphic);
            });
            if (hightlight != null) {
              hightlight.remove();
            }
          } else {
            if (hightlight != null) {
              hightlight.remove();
            }
          }
        });
      });

      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.initializeMap();
    // window.location.reload();
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      localStorage.removeItem('foo')
    }
  }

  ngOnDestroy() {
    if (this._view) {
      this._view.container = null;
    }
  }
}
