import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class ImageValidateService {

    validImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    constructor() {
    }

    base64MimeType(encoded: string) {
        var result = null;
        if (typeof encoded !== 'string') {
            return result;
        }
        var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
        if (mime && mime.length) {
            result = mime[1];
        }

        return result;
    }

    base64ToFile(obj: any) {
        const byteCharacters = atob(obj.base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: obj.type });
        var extention = obj.type.split('/');
        let file = new File([blob], 'cropImage.' + extention[1]);
        return file;
    }
}
