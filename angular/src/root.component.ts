import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppInitializer } from '../src/app-initializer';

@Component({
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`
})
export class RootComponent implements OnInit {
    latitude: any;
    longitude: any;
    locationSubscription: any;
    constructor(public signalRService: AppInitializer, private _http: HttpClient) { }

    ngOnInit() {
  }
}
