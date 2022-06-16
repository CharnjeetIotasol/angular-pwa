import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';
import { RedeemConfirmationDialogComponent } from '../common/redeem-confirmation-dialog/redeem-confirmation-dialog.component';

@Component({
  selector: 'app-voucher-detail',
  templateUrl: './voucher-detail.component.html',
  styleUrls: ['./voucher-detail.component.scss']
})
export class VoucherDetailComponent implements OnInit {
  @Input()
  voucherId: string;
  @Output()
  completeEvent = new EventEmitter<any>();
  voucher: any;
  isDetailPage: boolean;
  showBarCode: boolean;
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.isDetailPage = false;
    if (!this.voucherId) {
      this.isDetailPage = true;
      this.voucherId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    }
    this.fetchVoucherDetail();
  }

  fetchVoucherDetail() {
    this.loadingService.show();
    this.mapService.fetchVoucherDetail(this.voucherId)
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

  back() {
    if (this.isDetailPage) {
      this.router.navigate(["/dashboard"]);
      return;
    } else {
      this.completeEvent.emit({ "status": "MY_VOUCHER_REQUESTED", "messgae": "" });
    }
  }

  requestRedeemed() {
    const dialogRef = this.dialog.open(RedeemConfirmationDialogComponent, {
      width: "90%",
      panelClass: "custom-confirmation-popup"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.redeemVoucher()

      }
    });
  }

  redeemVoucher() {
    const input = {} as any;
    input.id = this.voucherId;
    this.loadingService.show();
    this.mapService.redeemVoucher(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          return;
        }
        this.showBarCode = true;
      }, (error) => {
        this.loadingService.hide();
      });
  }
}
