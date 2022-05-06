import { Injectable } from '@angular/core';

declare const $: any;
@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    constructor() {
    }

    show() {
        $("body").css({ "overflow": "hidden" });
        $("#loading").show();
    }

    hide() {
        $("body").css({ "overflow": "auto" });
        $("#loading").fadeOut(1000);
    }
}
