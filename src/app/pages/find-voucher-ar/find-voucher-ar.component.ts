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
  constructor() { }

  ngOnInit(): void {
    console.log(this.marker);
  }

  ngAfterViewInit(): void {
    AFRAME.registerComponent('clicker', {
      init: function () {
        this.el.addEventListener('click', (e: any) => {
          console.log(e);
          alert('Marker clicked!');
        });
      }
    });
  }
}
