// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: false,
  BaseApiUrl: 'https://reedemablevoucher.iotasol.com.au',
  AppHeaders: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }),
  GoogleKey: "846338494502-5jhd38d8r57h5j6pgbu17jiik7qpeu7p.apps.googleusercontent.com",
  GoogleSecretKey: "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",
  FacebookKey: "5107238159372417",
  FacebookSecretKey: "efaa19be7a475060aaaba935ad9e4716",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
