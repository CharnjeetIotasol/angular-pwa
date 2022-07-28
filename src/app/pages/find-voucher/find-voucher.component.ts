import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';

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
  completeEvent = new EventEmitter<any>();
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.options = {
      timeout: 10000,
      maximumAge: 0,
      enableHighAccuracy: true
    };
    if (this.isIOS()) {
      this.fetchMyCurrentLocation();
      return;
    }
    this.fetchMyCurrentLocation();
  }

  async requestPermissions(): Promise<any> {
    this.lastUpdateTime = undefined;
    this.minFrequency = 2000;
    try {
      const result: any = await navigator.permissions.query({ name: 'geolocation' });
      console.log('geolocation permission state is ', result.state);
      if (result.state === 'granted') {
        this.fetchMyCurrentLocation();
      } else {
        console.log('Browser location services disabled', navigator);
        this.noLocationFound();
      }
    } catch (error) {
      console.log(error);
      console.log('Browser permissions services unavailable', navigator);
      this.noLocationFound()
    }
  }

  isIOS() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  noLocationFound() {
    this.toastService.error("Sorry, We are not able to fetch location. Please enable location services");
  }

  onMapReady(map?: google.maps.Map) {
    if (!map) {
      return;
    }
    map.setOptions({
      streetViewControl: true,
      fullscreenControl: false
    });
  }

  fetchMyCurrentLocation() {
    console.log("Fetching current position....");
    navigator.geolocation.getCurrentPosition((position) => {
      const hasLoading = !this.lastCoords;
      console.log("Fetch new position from geolocation current location");
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
      this.fetchWatchLocations();
    }, (error) => {
      this.toastService.error(this.locationError(error));
    }, this.options);
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
    if (hasLoading) {
      this.loadingService.show();
    }
    const input = {} as any;
    input.latitude = coords.latitude;
    input.longitude = coords.longitude;
    input.requestDistance = 1000;
    //30.857435,75.832438
    input.latitude = 30.857435;
    input.longitude = 75.832438;
    this.lastCoords = input;
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
    if (marker.type === "DISCOUNT" || marker.type === "VOUCHER" || marker.type === "HUNT VOUCHER") {
      this.completeEvent.emit({ "status": "START_FIND_VOUCHER_AR", "messgae": marker });
      //this.collectEvent.emit(marker);
      return;
    }
    if (marker.type === "HUNT") {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: "90%",
        panelClass: "custom-message-popup",
        data: {
          icon: "/assets/images/icons/hunt-start-icon.svg",
          title: "Would you like to start the Hunt?",
          subTitle: "There are many variation have suffered alteration",
          actions: true
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (!result) {
          return;
        }
        this.startHunt(marker);
      });
    }
    if (marker.type === "TRIVIA") {
      const dialogRef = this.dialog.open(MessageDialogComponent, {
        width: "90%",
        panelClass: "custom-message-popup",
        data: {
          icon: "/assets/images/icons/trivia-start-icon.svg",
          title: "Would you like to start the Trivia?",
          subTitle: "There are many variation have suffered alteration",
          actions: true
        }
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (!result) {
          return;
        }
        this.startTrivia(marker);
      });
    }
  }

  startHunt(marker: any) {
    const input = {} as any;
    input.hunt = marker.id;
    this.loadingService.show();
    this.mapService.startHunt(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        this.fetchMarkers(this.lastCoords, false)
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  startTrivia(marker: any) {
    const input = {} as any;
    input.trivia = marker.id;
    this.loadingService.show();
    this.mapService.startTrivia(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        this.completeEvent.emit({ "status": "START_TRIVIA_REQUESTED", "messgae": marker.id, "triviaId": response.data });
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  ngOnDestroy(): void {
    this.clearWatchLocations();
  }
}
