import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: true,
  BaseApiUrl: 'https://reedemablevoucher.iotasol.com.au',
  AppHeaders: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  })
};
