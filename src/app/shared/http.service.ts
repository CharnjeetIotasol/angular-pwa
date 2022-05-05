import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FilterParam } from '../models/filterparam';
import { IResourceWithId, RestResponse } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceRequests<TResource extends IResourceWithId> {
  headers = environment.AppHeaders;

  constructor(public http: HttpClient) {
  }

  getRecords(path: string, filterParam: FilterParam): Promise<RestResponse> {
    return this.http
      .post(environment.BaseApiUrl + path, filterParam, { headers: environment.AppHeaders })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  getRecord(path: string): Observable<any> {
    return this.http
      .get(environment.BaseApiUrl + path, { headers: environment.AppHeaders })
      .pipe(catchError(this.handleError));
  }

  saveRecord(path: string, resource: TResource): Promise<RestResponse> {
    return this.http
      .post(environment.BaseApiUrl + path, resource, { headers: environment.AppHeaders })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  updateRecord(path: string, resource: TResource): Promise<RestResponse> {
    return this.http
      .put(environment.BaseApiUrl + path, resource, { headers: environment.AppHeaders })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  removeRecord(path: string): Promise<RestResponse> {
    return this.http
      .delete(environment.BaseApiUrl + path, { headers: environment.AppHeaders })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  postUrl(path: string): Promise<RestResponse> {
    return this.http
      .post(environment.BaseApiUrl + path, { headers: environment.AppHeaders })
      .toPromise()
      .then((response) => {
        return response;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.error);
  }
}
