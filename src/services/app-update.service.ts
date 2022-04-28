import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    constructor(private readonly updates: SwUpdate) {
        console.log(updates.isEnabled);
        if (updates.isEnabled) {
            interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
                .then(() => {
                    console.log('checking for updates')
                    this.updates.available.subscribe(event => {
                        this.showAppUpdateAlert();
                    });
                }));
        }

    }
    showAppUpdateAlert() {
        const header = 'App Update available';
        const message = 'Choose Ok to update';
        const action = this.doAppUpdate;
        if (confirm(header)) {
            this.updates.activateUpdate().then(() => document.location.reload());
        }
    }

    doAppUpdate() {
        this.updates.activateUpdate().then(() => document.location.reload());
    }
}