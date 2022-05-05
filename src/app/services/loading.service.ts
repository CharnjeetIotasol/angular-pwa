import { Injectable } from '@angular/core';

declare const $: any;
@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor() {
    }

    show() {
        $(".loader-container").show();
    }

    hide() {
        $(".loader-container").fadeOut(1000);
    }
}
