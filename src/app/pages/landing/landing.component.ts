import { Component, OnInit } from '@angular/core';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  markers: Array<any>;
  currentTab = "VOCUHER_VIEW";
  watchLocationId: any;
  options: any;
  lastUpdateTime: any;
  minFrequency: number;
  lastCoords: any;
  selectedTabIndex: number;
  user: Login;
  onClickValidation: boolean;
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.selectedTabIndex = 3;
    this.currentTab = "MY_VOUCHER_VIEW";
    this.options = {
      timeout: 5000,
      maximumAge: 0,
      enableHighAccuracy: true
    };
    //this.requestPermissions();
    //this.fetchMyVouchers();
    this.fetchMyDetail();
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
        this.toastService.success("Distance: " + distance);
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
    input.latitude = coords.latitude;
    input.longitude = coords.longitude;
    input.requestDistance = 80;
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
      }, (error) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  fetchMyVouchers() {
    this.loadingService.show();
    this.mapService.fetchMyVouchers()
      .subscribe((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        console.log(response.data);
      }, (error) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
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

  onTabChanged($event: any) {
    this.currentTab = $event.index === 0 ? "VOCUHER_VIEW"
      : $event.index === 1 ? "MY_VOUCHER_VIEW"
        : $event.index === 2 ? "LEADERBOARD_VIEW"
          : $event.index === 3 ? "ACCOUNT_SETTING_VIEW"
            : "OTHER";

    if (this.currentTab === "VOCUHER_VIEW") {
      this.requestPermissions();
    } else if (this.currentTab === "MY_VOUCHER_VIEW") {
      this.clearWatchLocations();
      this.fetchMyVouchers();
    } else if (this.currentTab === "LEADERBOARD_VIEW") {
      this.clearWatchLocations();
    } else if (this.currentTab === "ACCOUNT_SETTING_VIEW") {
      this.fetchMyDetail();
      this.clearWatchLocations();
    }
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

  fetchMyDetail() {
    this.user = new Login();
  }

  onAddressChange(address: any) {
    this.user.address = address.formatted_address;
  }
}
