import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-my-vouchers',
  templateUrl: './my-vouchers.component.html',
  styleUrls: ['./my-vouchers.component.scss']
})
export class MyVouchersComponent implements OnInit {

  allRecords: Array<any>;
  myVouchers: Array<any>;
  myHunts: Array<any>;
  loading: boolean;
  @Output()
  completeEvent = new EventEmitter<any>();
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchMyVouchers();
  }

  fetchMyVouchers() {
    this.loadingService.show();
    this.myVouchers = new Array<any>();
    this.loading = true;
    this.mapService.fetchMyVouchers()
      .subscribe((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        const data = response.data;
        this.allRecords = new Array<any>();
        this.myVouchers = data.voucherDetails;
        this.myHunts = data.hunts;
        this.myVouchers.forEach((record) => {
          if (record.categoryDetail && record.categoryDetail.icon && record.categoryDetail.icon.length > 0) {
            record.categoryDetail.selectedIcon = record.categoryDetail.icon[0];
          }
          if (record.status === "REDEEMED") {
            record.processingDate = record.redeemedDate;
          }
          if (record.status === "COLLECTED") {
            record.processingDate = record.collectedOn;
          }
          record.processingType = "VOUCHER";
        });
        this.myHunts.forEach((hunt) => {
          hunt.processingDate = hunt.createdOn;
          hunt.processingType = "HUNT";
        });
        this.allRecords.push(...this.myVouchers);
        this.allRecords.push(...this.myHunts);
        this.allRecords.sort(function (a, b) { return new Date(a.processingDate).getTime() - new Date(b.processingDate).getTime() });
        this.loading = false;
      }, (error) => {
        this.loading = false;
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  loadFindVoucher() {
    this.completeEvent.emit({ "status": "FIND_VOUCHER_REQUESTED_FROM_MY_VOUCHER", "messgae": "" });
  }

  async share(voucher: any, $event: any) {
    const path = location.origin;
    navigator.share({
      url: `${path}/dashboard/voucher/${voucher.id}`,
      title: voucher.voucher.name,
      text: voucher.voucher.name,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing'));
  }

  redeem(voucher: any) {
    if (voucher.processingType === "HUNT") {
      return;
    }
    this.completeEvent.emit({ "status": "VOUCHER_DETAIL_REQUESTED", "messgae": voucher.id });
  }
}
