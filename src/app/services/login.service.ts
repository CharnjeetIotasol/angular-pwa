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

    socialLogin(data: any): Promise<RestResponse> {
        return this.saveRecord('/api/account/user/social/register', data);
    }

    register(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer', data);
    }

    forgotPassword(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/forgotpassword', data);
    }

    recoverPassword(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/resetpassword', data);
    }

    fetchCompanies(data: any): Promise<RestResponse> {
        return this.saveRecord('/api/account/getcompanies', data);
    }

    changePassword(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/changepassword', data);
    }
}
