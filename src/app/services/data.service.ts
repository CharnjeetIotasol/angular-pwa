import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterParam } from '../models/filterparam';
import { IResourceWithId, RestResponse } from '../shared/auth.model';
import { HttpServiceRequests } from '../shared/http.service';

@Injectable({
    providedIn: 'root'
})
export class DataService extends HttpServiceRequests<IResourceWithId> {

    constructor(public http: HttpClient) {
        super(http);
    }

    fetchCategories(): Promise<RestResponse> {
        return this.getRecords('/api/categories', new FilterParam());
    }

    saveCategories(categories: any): Promise<RestResponse> {
        return this.saveRecord('/app/customer/categories', categories);
    }

    fetchMyDetail(): Observable<RestResponse> {
        return this.getRecord('/app/customer');
    }

    updateMyDetail(input: any): Promise<RestResponse> {
        return this.updateRecord('/app/customer', input);
    }
}
