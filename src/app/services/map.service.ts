import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
}
