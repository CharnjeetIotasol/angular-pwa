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
    const parent = this;
    AFRAME.registerComponent('clicker', {
      init: function () {
        const animatedModel = this.el;
        animatedModel.addEventListener('click', (ev: any, target: any) => {
          if (parent.hasMarkerDetailOpen) {
            return;
          }
          parent.hasMarkerDetailOpen = true;
          alert("Got Click");
          setTimeout(() => {
            parent.collectEvent.emit(parent.marker);
          })
        });
      }
    });
  }
}
