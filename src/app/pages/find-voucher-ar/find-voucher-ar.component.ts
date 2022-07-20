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
    alert("Here");
    setTimeout(() => {
      alert("Init clicker");
      AFRAME.registerComponent('clicker', {
        init: function () {
          this.el.addEventListener('click', (e: any) => {
            alert('Marker clicked!');
            console.log(e);
          });
        }
      });
    }, 2000);
  }

  collectMarker() {
    alert("Yes, Click work");
  }
}
