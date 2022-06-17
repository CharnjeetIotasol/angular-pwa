import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('0ms', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ],
})
export class LandingComponent implements OnInit {
  currentTab: string;
  selectedVoucherId: string;
  selectedMarkerId: string;
  selectedTabIndex: number;
  tabView: string;

  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.selectedTabIndex = 0;
    this.currentTab = "VOCUHER_VIEW";
    this.tabView = "FIND_VOUCHER_VIEW";
  }

  onTabChanged($event: any) {
    this.currentTab = $event.index === 0 ? "VOCUHER_VIEW"
      : $event.index === 1 ? "MY_VOUCHER_VIEW"
        : $event.index === 2 ? "LEADERBOARD_VIEW"
          : $event.index === 3 ? "ACCOUNT_SETTING_VIEW"
            : "OTHER";

    if (this.currentTab === "VOCUHER_VIEW") {
      this.tabView = "FIND_VOUCHER_VIEW";
    } else if (this.currentTab === "MY_VOUCHER_VIEW") {
      this.tabView = "MY_VOUCHER_VIEW";
    } else if (this.currentTab === "LEADERBOARD_VIEW") {
      this.tabView = "LEADERBOARD";
    } else if (this.currentTab === "ACCOUNT_SETTING_VIEW") {
      this.tabView = "PROFILE_VIEW";
    }
  }



  onCompleteEvent($event: any) {
    if ($event.status === "COMPLETED") {
      this.tabView = "PROFILE_VIEW";
      return;
    } else if ($event.status === "CHANGE_PASSWORD_REQUESTED") {
      this.tabView = "CHANGE_PASSWORD_VIEW";
      return;
    } else if ($event.status === "INTEREST_REQUESTED") {
      this.tabView = "INTEREST_VIEW";
      return;
    } else if ($event.status === "FIND_VOUCHER_REQUESTED") {
      this.currentTab = "VOCUHER_VIEW";
      this.selectedTabIndex = 0;
      this.tabView = "FIND_VOUCHER_VIEW";
      return;
    } else if ($event.status === "FIND_VOUCHER_REQUESTED_FROM_MY_VOUCHER") {
      this.currentTab = "VOCUHER_VIEW";
      this.selectedTabIndex = 0;
      this.tabView = "FIND_VOUCHER_VIEW";
    } else if ($event.status === "VOUCHER_DETAIL_REQUESTED") {
      this.selectedVoucherId = $event.messgae;
      this.tabView = "VOUCHER_DETAIL_VIEW";
      return;
    } else if ($event.status === "MY_VOUCHER_REQUESTED") {
      this.tabView = "MY_VOUCHER_VIEW";
    }

  }

  onCollectEvent($event: any) {
    this.selectedVoucherId = $event.voucherId;
    this.selectedMarkerId = $event.id;
    this.tabView = "VOUCHER_COLLECT_VIEW";
  }
}
