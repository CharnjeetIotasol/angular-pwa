import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare const AFRAME: any;
@Component({
  selector: 'app-find-voucher-ar',
  templateUrl: './find-voucher-ar.component.html',
  styleUrls: ['./find-voucher-ar.component.scss']
})
export class FindVoucherArComponent implements OnInit, AfterViewInit {

  @Input()
  marker: any;
  @Output()
  collectEvent = new EventEmitter<any>();
  hasMarkerDetailOpen: boolean;
  iconPath: string;
  constructor() { }

  ngOnInit(): void {
    this.iconPath = this.marker.logo.length > 0 ? this.marker.logo[0].path : '/assets/images/icons/map-pin-default-small.png';
    alert(this.iconPath);
    this.hasMarkerDetailOpen = false;
  }

  ngAfterViewInit(): void {

  }

  collect() {
    if (this.hasMarkerDetailOpen) {
      return;
    }
    this.hasMarkerDetailOpen = true;
    setTimeout(() => {
      this.collectEvent.emit(this.marker);
    });
  }
}
