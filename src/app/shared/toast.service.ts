import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  configSuccess: MatSnackBarConfig = {
    panelClass: ['style-success'],
    horizontalPosition: "center",
    verticalPosition: "bottom",
    duration: 10000
  };

  errorSuccess: MatSnackBarConfig = {
    panelClass: ['style-error'],
    horizontalPosition: "center",
    verticalPosition: "bottom",
    duration: 10000
  };

  constructor(private _snackBar: MatSnackBar) {
  }

  error(text: string): void {
    this._snackBar.open(text, 'OK', this.errorSuccess);
  }

  success(text: string): void {
    this._snackBar.open(text, 'OK', this.configSuccess);
  }
}
