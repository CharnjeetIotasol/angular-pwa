import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IResourceWithId, RestResponse } from "../shared/auth.model";
import { HttpServiceRequests } from "../shared/http.service";

@Injectable({
    providedIn: 'root'
})
export class MapService extends HttpServiceRequests<IResourceWithId> {

    constructor(public http: HttpClient) {
        super(http);
    }

    fetchVocuherNearMe(data: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/marker/nearme', data);
    }

    fetchMyVouchers(): Observable<RestResponse> {
        return this.getRecord('/app/customer/vouchers/all');
    }

    fetchVoucherDetail(voucherId: string): Observable<RestResponse> {
        return this.getRecord(`/app/customer/marker/detail/${voucherId}`);
    }

    collectVoucher(input: any): Promise<RestResponse> {
        return this.saveRecord(`/app/customer/voucher/collect`, input);
    }

    redeemVoucher(input: any): Promise<RestResponse> {
        return this.saveRecord(`/app/customer/voucher/redeem`, input);
    }
}
