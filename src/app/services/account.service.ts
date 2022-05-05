import {Injectable} from '@angular/core';
import {HttpServiceRequests} from '../shared/http.service';
import {IResourceWithId, RestResponse} from '../shared/auth.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends HttpServiceRequests<IResourceWithId> {

  constructor(public http: HttpClient) {
    super(http);
  }

  fetchMe(): Promise<RestResponse> {
    return this.getRecords('/api/account/user', null);
  }

  changePassword(data: any): Promise<RestResponse> {
    return this.saveRecord('/api/account/changePassword', data);
  }

  update(data: any): Promise<RestResponse> {
    return this.updateRecord('/api/account/user', data);
  }
}
