import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit, OnDestroy {
  color: ThemePalette = 'accent';
  view: string;
  value: number;
  timerSubscription: Subscription;
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {
    this.view = "AVAILABLE";
  }

  ngOnInit(): void {
  }

  installApp() {
    this.value = 0;
    this.view = "INSTALL";
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      this.value = this.value + 20;
    });
    setTimeout(() => {
      this.dialogRef.close(true);
    }, 5000);
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }
}
