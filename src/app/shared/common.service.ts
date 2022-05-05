import { Injectable } from '@angular/core';

declare const swal: any;
declare const sweetAlert: any;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() {
  }

  confirmation(heading: string, callback: any, param1 = null, param2 = null, param3 = null) {
    swal({
      title: heading,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d9534f',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      closeOnConfirm: false,
      allowEscapeKey: false,
      animation: false
    }, () => {
      sweetAlert.close();
      callback(param1, param2, param3);
    });
  }

  info(heading: string, subText: string, callback: any, param1 = null, param2 = null) {
    swal({
      title: heading,
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#d9534f',
      confirmButtonText: subText,
      cancelButtonText: 'No',
      closeOnConfirm: false,
      allowEscapeKey: false,
      animation: false
    }, () => {
      sweetAlert.close();
      callback(param1, param2);
    });
  }
}
