import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FilterParam } from '../models/filterparam';
import { IResourceWithId, RestResponse } from '../shared/auth.model';
import { HttpServiceRequests } from '../shared/http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends HttpServiceRequests<IResourceWithId> {

  constructor(public http: HttpClient) {
    super(http);
  }

  fetchMe(): Promise<RestResponse> {
    return this.getRecords('/api/account/user', new FilterParam());
  }

  changePassword(data: any): Promise<RestResponse> {
    return this.saveRecord('/api/account/changePassword', data);
  }

  update(data: any): Promise<RestResponse> {
    return this.updateRecord('/api/account/user', data);
  }
}
