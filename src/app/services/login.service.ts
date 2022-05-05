import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResourceWithId, RestResponse } from '../shared/auth.model';
import { HttpServiceRequests } from '../shared/http.service';

@Injectable({
    providedIn: 'root'
})
export class LoginService extends HttpServiceRequests<IResourceWithId> {

    constructor(public http: HttpClient) {
        super(http);
    }

    login(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/login', data);
    }

    resetPassword(data: any): Promise<RestResponse> {
        return this.saveRecord('/api/account/forgot/password', data);
    }

    recoverPassword(data: any): Promise<RestResponse> {
        return this.saveRecord('/api/account/reset/password', data);
    }

    fetchCompanies(data: any): Promise<RestResponse> {
        return this.saveRecord('/api/account/GetCompanies', data);
    }
}
