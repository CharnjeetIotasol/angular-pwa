import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-redeem-confirmation-dialog',
  templateUrl: './redeem-confirmation-dialog.component.html',
  styleUrls: ['./redeem-confirmation-dialog.component.scss']
})
export class RedeemConfirmationDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<RedeemConfirmationDialogComponent>) { }

  ngOnInit(): void {
  }

  yes() {
    this.dialogRef.close(true);
  }
}
