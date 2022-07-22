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
    AFRAME.registerComponent('clicker', {
      init: function () {
        const animatedModel = this.el;
        animatedModel.addEventListener('click', (ev: any, target: any) => {
          alert("Got Click Event");
          const intersectedElement = ev && ev.detail && ev.detail.intersectedEl;
          if (animatedModel && intersectedElement === animatedModel) {
            const objectId = animatedModel.id;
            alert('Marker clicked yoooooooooo! ');
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    // AFRAME.registerComponent('clicker', {
    //   init: function () {
    //     alert("clicker init called");
    //     this.el.addEventListener('click', (e: any) => {
    //       alert('Marker clicked!');
    //       if (this.hasMarkerDetailOpen) {
    //         return;
    //       }
    //       alert("Here");
    //       this.hasMarkerDetailOpen = true;
    //       setTimeout(() => {
    //         this.collectEvent.emit(this.marker);
    //       })
    //     });
    //   }
    // });
  }
}
