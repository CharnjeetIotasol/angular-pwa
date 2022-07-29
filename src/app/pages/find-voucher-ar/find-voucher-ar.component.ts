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
    AFRAME.registerComponent('clicker', {
      init: () => {
        const animatedModel: any = document.querySelector('a-image');
        animatedModel.addEventListener('click', (ev: any, target: any) => {
          if (this.hasMarkerDetailOpen) {
            return;
          }
          this.hasMarkerDetailOpen = true;
          alert("Got Click");
          setTimeout(() => {
            this.collectEvent.emit(this.marker);
          });
        });
      }
    });
  }

  abc() {
    if (this.hasMarkerDetailOpen) {
      return;
    }
    this.hasMarkerDetailOpen = true;
    alert("Got Click");
    setTimeout(() => {
      this.collectEvent.emit(this.marker);
    });
  }
}
