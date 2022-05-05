import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommonUtil {

    logging(type: string, message: string, functionName: string, fileName: string) {
        if (!environment.production) {
            console.log('Type:' + type + ' In Function:' + functionName + ' In File: ' + fileName);
            console.log(message);
        }
    }

    static isNullOrUndefined(value: any) {
        return value === undefined || value === null;
    }
}
