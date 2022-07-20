import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare const AFRAME: any;
@Component({
  selector: 'app-find-voucher-ar',
  templateUrl: './find-voucher-ar.component.html',
  styleUrls: ['./find-voucher-ar.component.scss']
})
export class FindVoucherArComponent implements OnInit {

  @Input()
  marker: any;
  @Output()
  collectEvent = new EventEmitter<any>();
  hasMarkerDetailOpen: boolean;
  constructor() { }

  ngOnInit(): void {
    this.hasMarkerDetailOpen = false;
  }

  collectMarker() {
    alert("Click");
    if (this.hasMarkerDetailOpen) {
      return;
    }
    alert("Here");
    this.hasMarkerDetailOpen = true;
    setTimeout(() => {
      this.collectEvent.emit(this.marker);
    })
  }
}
