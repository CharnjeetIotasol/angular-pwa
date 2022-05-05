import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    shownAlert: boolean;
    constructor(private readonly updates: SwUpdate) {
        console.log("Here Setting False");
        this.shownAlert = false;
        console.log(updates.isEnabled);
        if (updates.isEnabled) {
            interval(6 * 60 * 60).subscribe(() => updates.checkForUpdate()
                .then(() => {
                    console.log('checking for updates')
                    this.updates.versionUpdates
                        .subscribe(event => {
                            console.log(event);
                            this.showAppUpdateAlert();
                        });
                }));
        }

    }
    checkForUpdate() {
        console.log("Here checkForUpdate");
        console.log(this.updates.isEnabled);
        if (this.updates.isEnabled) {
            this.updates.checkForUpdate().then(() => {
                console.log('Checking for updates...');
            }).catch((err) => {
                console.error('Error when checking for update', err);
            });
        }
    }
    showAppUpdateAlert() {
        if (this.shownAlert) {
            return;
        }
        this.shownAlert = true;
        const header = 'App Update available';
        const message = 'Choose Ok to update';
        const action = this.doAppUpdate;
        if (confirm(header)) {
            this.updates.activateUpdate().then(() => {
                this.shownAlert = false;
                document.location.reload();
            });
        }
    }

    doAppUpdate() {
        this.updates.activateUpdate().then(() => document.location.reload());
    }
}