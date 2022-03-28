import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
declare const $: any
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

    toggleMenu() {
        if ($('#sidebar').hasClass('active')) {
            $('#sidebar').addClass('content-body-active');
            $('#sidebar').removeClass('active');
            $('#content').addClass('window-content-body');
            $('#content').removeClass('mobile-content-body');
        } else {
            $('#sidebar').addClass('active');
            $('#sidebar').removeClass('content-body-active');
            $('#content').removeClass('window-content-body');
            $('#content').addClass('mobile-content-body');
        }
    }

    static isNullOrUndefined(value: string) {
        return value === undefined || value === null;
    }
}
