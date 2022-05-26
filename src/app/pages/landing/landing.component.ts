import { Component, OnInit } from '@angular/core';
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
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.fetchMyLocations();
  }


  fetchMyLocations(): void {
    navigator.permissions.query({ name: 'geolocation' })
      .then((permissionStatus) => {
        console.log('geolocation permission state is ', permissionStatus.state);
        navigator.geolocation.getCurrentPosition((position) => {
          console.log('Geolocation permissions granted');
          console.log('Latitude:' + position.coords.latitude);
          console.log('Longitude:' + position.coords.longitude);
          this.fetchMarkers(position.coords);
        }, (error) => {
          this.toastService.error(this.locationError(error));
        }, {
          timeout: 2000,
          maximumAge: 20000,
          enableHighAccuracy: true
        });

      });

    // navigator.permissions.query({ name: 'geolocation' })
    //   .then((response) => {
    //     console.log(response);
    //     navigator.geolocation.getCurrentPosition(position => {
    //       this.fetchMarkers(position.coords);
    //     }, error => {
    //       this.toastService.error(this.locationError(error));
    //     }, {
    //       timeout: 2000,
    //       maximumAge: 20000,
    //       enableHighAccuracy: true
    //     });
    //   })
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

  fetchMarkers(coords: any) {
    this.markers = new Array<any>();
    this.loadingService.show();
    const input = {} as any;
    input.latitude = coords.latitude;
    input.longitude = coords.longitude;
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
        })
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
}
