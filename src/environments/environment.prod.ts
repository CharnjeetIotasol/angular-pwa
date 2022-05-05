import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production: true,
  BaseApiUrl: 'https://reedemablevoucher.iotasol.com.au',
  AppHeaders: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }),
  GoogleKey: "846338494502-5jhd38d8r57h5j6pgbu17jiik7qpeu7p.apps.googleusercontent.com",
  GoogleSecretKey: "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",
  FacebookKey: "650995642649107",
  FacebookSecretKey: "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",
};
