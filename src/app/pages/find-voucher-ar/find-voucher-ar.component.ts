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
  constructor() { }

  ngOnInit(): void {
    this.hasMarkerDetailOpen = false;
  }

  ngAfterViewInit(): void {
    AFRAME.registerComponent("markerhandler", {
      init: function () {
        const animatedModel = this.el;
        let isMarkerVisible = false;
        alert("here 1");
      }
    })
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
