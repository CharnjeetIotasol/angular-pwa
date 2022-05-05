import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { ConfirmationDialogComponent } from 'src/app/pages/common/confirmation-dialog/confirmation-dialog.component';
@Injectable({
    providedIn: 'root'
})
export class AppUpdateService {
    shownAlert: boolean;
    constructor(private readonly updates: SwUpdate, private dialog: MatDialog) {
        this.shownAlert = false;
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
        this.openUpdateConfirmationDialog();
    }

    openUpdateConfirmationDialog() {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: "90%",
            position: { bottom: "50px" },
            panelClass: "custom-update-popup"
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.doAppUpdate();
            }
        });
    }

    doAppUpdate() {
        this.updates.activateUpdate().then(() => {
            this.shownAlert = false;
            document.location.reload();
        });
    }
}