import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-find-voucher',
  templateUrl: './find-voucher.component.html',
  styleUrls: ['./find-voucher.component.scss']
})
export class FindVoucherComponent implements OnInit, OnDestroy {
  markers: Array<any>;
  watchLocationId: any;
  options: any;
  lastUpdateTime: any;
  minFrequency: number;
  lastCoords: any;
  @Output()
  collectEvent = new EventEmitter<any>();
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.options = {
      timeout: 5000,
      maximumAge: 0,
      enableHighAccuracy: true
    };
    this.requestPermissions();
  }

  requestPermissions(): void {
    this.lastUpdateTime = undefined;
    this.minFrequency = 2000;
    navigator.permissions.query({ name: 'geolocation' })
      .then((permissionStatus) => {
        console.log('geolocation permission state is ', permissionStatus.state);
        this.fetchWatchLocations();
      });
  }

  onMapReady(map?: google.maps.Map) {
    if (!map) {
      return;
    }
    map.setOptions({
      streetViewControl: false,
      fullscreenControl: false
    });
  }

  fetchWatchLocations() {
    console.log("Watching position....");
    if (this.watchLocationId) {
      console.log("Watching position already active....", this.watchLocationId);
      this.clearWatchLocations();
      setTimeout(() => {
        this.fetchWatchLocations();
      }, 200);
      return;
    }
    this.watchLocationId = navigator.geolocation.watchPosition((position) => {
      const hasLoading = !this.lastCoords;
      console.log("Fetch new position from geolocation watch");
      const now = new Date();
      if (this.lastUpdateTime && now.getTime() - this.lastUpdateTime.getTime() < Number(this.minFrequency)) {
        console.log("Skipping postion due to min frequency time");
        return;
      }
      const distance = this.distance(position.coords, this.lastCoords);
      if (this.lastCoords && distance <= 5) {
        console.log("Skipping postion due to min distance");
        return;
      }
      this.lastCoords = position.coords;
      this.lastUpdateTime = now;
      this.fetchMarkers(position.coords, hasLoading);
    }, (error) => {
      this.toastService.error(this.locationError(error));
    }, this.options);
  }

  clearWatchLocations() {
    console.log('Clearing watch position', this.watchLocationId);
    if (!this.watchLocationId) {
      return;
    }
    navigator.geolocation.clearWatch(this.watchLocationId);
    this.watchLocationId = undefined;
    this.lastUpdateTime = undefined;
    this.lastCoords = undefined;
  }

  locationError(error: any): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable."
        break;
      case error.TIMEOUT:
        return "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        return "An unknown error occurred."
        break;
    }
    return "Somethings went wrong. Please try after sometime";
  }

  fetchMarkers(coords: any, hasLoading: boolean) {
    console.log("Fetching available vouchers from source...");
    this.markers = new Array<any>();
    if (hasLoading) {
      this.loadingService.show();
    }
    const input = {} as any;
    //30.861999,75.834420
    input.latitude = coords.latitude;
    input.longitude = coords.longitude;
    // input.latitude = 30.861999;
    // input.longitude = 75.834420;
    input.requestDistance = 500;
    this.mapService.fetchVocuherNearMe(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        this.markers = response.data;
        this.markers.forEach((marker) => {
          marker.latitude = Number(marker.latitude);
          marker.longitude = Number(marker.longitude);
        });
        if (this.markers.length <= 0) {
          const marker = {} as any;
          marker.latitude = coords.latitude;
          marker.longitude = coords.longitude;
          this.markers.push(marker);
        }
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  distance(coords: any, eCoords: any): Number {
    if (!coords || !eCoords) {
      return 0;
    }
    const earthRadius = 6371000; // meters
    const dLat = this.toRad(eCoords.latitude - coords.latitude);
    const dLng = this.toRad(eCoords.longitude - coords.longitude);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coords.latitude)) * Math.cos(this.toRad(eCoords.latitude)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = (earthRadius * c);
    return Number(dist);
  }

  toRad(deg: any) {
    return deg * (Math.PI / 180);
  }

  collect(marker: any) {
    this.collectEvent.emit(marker);
  }

  ngOnDestroy(): void {
    this.clearWatchLocations();
  }
}
