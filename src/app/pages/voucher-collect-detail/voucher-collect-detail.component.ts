import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';
import { MessageDialogComponent } from '../common/message-dialog/message-dialog.component';

@Component({
  selector: 'app-voucher-collect-detail',
  templateUrl: './voucher-collect-detail.component.html',
  styleUrls: ['./voucher-collect-detail.component.scss']
})
export class VoucherCollectDetailComponent implements OnInit {

  @Input()
  voucherId: string;
  @Input()
  markerId: string;
  voucher: any;
  @Output()
  completeEvent = new EventEmitter<any>();
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchVoucherDetail();
  }

  fetchVoucherDetail() {
    this.loadingService.show();
    this.mapService.fetchVoucherDetail(this.markerId)
      .subscribe((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        this.voucher = response.data;
        if (this.voucher.categoryDetail && this.voucher.categoryDetail.icon && this.voucher.categoryDetail.icon.length > 0) {
          this.voucher.categoryDetail.selectedIcon = this.voucher.categoryDetail.icon[0];
        }
      }, (error) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      })
  }

  collect() {
    const input = {} as any;
    input.id = this.markerId;
    this.loadingService.show();
    this.mapService.collectVoucher(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.showFailureMessage(response.message);
          return;
        }
        this.showSuccessMessage();
      }, (error) => {
        this.loadingService.hide();
        this.showFailureMessage(error.message);
      })
  }

  showSuccessMessage() {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "90%",
      panelClass: "custom-message-popup",
      data: { icon: "/assets/images/icons/success.svg", title: "Congratulations!", subTitle: "You have won the vouhcer! Please redeemed your voucher from my vouhcer." }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.completeEvent.emit({ "status": "FIND_VOUCHER_REQUESTED", "messgae": "" });
      }
    });
  }

  showFailureMessage(message: string) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "90%",
      panelClass: "custom-message-popup",
      data: { icon: "/assets/images/icons/failure.svg", title: "Oops", subTitle: message }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  back() {
    this.completeEvent.emit({ "status": "FIND_VOUCHER_REQUESTED", "messgae": "" });
  }
}
