import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { AuthService } from 'src/app/shared/auth.services';
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
  selectedVoucherId: string;
  selectedMarkerId: string;
  selectedTriviaId: string;
  selectedTabIndex: number;
  tabView: string;
  history: Array<string>;
  shownExitMessage: boolean;
  isPartnerUser: boolean;
  selectedMarker: any;

  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private dialog: MatDialog,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.isPartnerUser = this.authService.isPartnerUser();
    this.shownExitMessage = false;
    this.history = new Array<string>();
    this.selectedTabIndex = 0;
    this.tabView = "FIND_VOUCHER_VIEW";
    this.addToHistory(this.tabView);
  }

  getPWADisplayMode() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (document.referrer.startsWith('android-app://')) {
      return 'twa';
    } else if (isStandalone) {
      return 'standalone';
    }
    return 'browser';
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    if (this.history.length <= 1) {
      console.log("Skipping back button due to no history is available");
      if (this.getPWADisplayMode() === "standalone") {
        if (this.shownExitMessage) {
          event.preventDefault();
          self.close();
          window.close();
          return;
        }
        this.toastService.info("Press back again to exit");
        this.shownExitMessage = true;
      }
      return;
    }
    this.history.pop();
    const url = this.history[this.history.length - 1];
    this.tabView = url;
    if (["FIND_VOUCHER_VIEW", "VOUCHER_COLLECT_VIEW"].indexOf(this.tabView) !== -1) {
      this.selectedTabIndex = 0;
    } else if (["MY_VOUCHER_VIEW", "VOUCHER_DETAIL_VIEW"].indexOf(this.tabView) !== -1) {
      this.selectedTabIndex = 1;
    } else if (["LEADERBOARD"].indexOf(this.tabView) !== -1) {
      this.selectedTabIndex = 2;
    } else if (["PROFILE_VIEW", "CHANGE_PASSWORD_VIEW", "INTEREST_VIEW"].indexOf(this.tabView) !== -1) {
      this.selectedTabIndex = 3;
    }
  }

  addToHistory(url: string) {
    if (this.history.length > 0 && this.history[this.history.length - 1] === url) {
      console.log("Skipping because already at last postion");
      return;
    }
    this.history.push(url);
  }

  onTabChanged($event: any) {
    const currentTab = $event.index === 0 ? "VOCUHER_VIEW"
      : $event.index === 1 ? "MY_VOUCHER_VIEW"
        : $event.index === 2 ? "LEADERBOARD_VIEW"
          : $event.index === 3 ? "ACCOUNT_SETTING_VIEW"
            : "OTHER";

    if (currentTab === "VOCUHER_VIEW") {
      this.tabView = "FIND_VOUCHER_VIEW";
    } else if (currentTab === "MY_VOUCHER_VIEW") {
      this.tabView = "MY_VOUCHER_VIEW";
    } else if (currentTab === "LEADERBOARD_VIEW") {
      this.tabView = "LEADERBOARD";
    } else if (currentTab === "ACCOUNT_SETTING_VIEW") {
      this.tabView = "PROFILE_VIEW";
    }
    this.addToHistory(this.tabView);
  }



  onCompleteEvent($event: any) {
    if ($event.status === "COMPLETED") {
      this.tabView = "PROFILE_VIEW";
    } else if ($event.status === "CHANGE_PASSWORD_REQUESTED") {
      this.tabView = "CHANGE_PASSWORD_VIEW";
    } else if ($event.status === "INTEREST_REQUESTED") {
      this.tabView = "INTEREST_VIEW";
    } else if ($event.status === "FIND_VOUCHER_REQUESTED") {
      this.selectedTabIndex = 0;
      this.tabView = "FIND_VOUCHER_VIEW";
    } else if ($event.status === "FIND_VOUCHER_REQUESTED_FROM_MY_VOUCHER") {
      this.selectedTabIndex = 0;
      this.tabView = "FIND_VOUCHER_VIEW";
    } else if ($event.status === "VOUCHER_DETAIL_REQUESTED") {
      this.selectedVoucherId = $event.messgae;
      this.tabView = "VOUCHER_DETAIL_VIEW";
    } else if ($event.status === "MY_VOUCHER_REQUESTED") {
      this.tabView = "MY_VOUCHER_VIEW";
    } else if ($event.status === "START_TRIVIA_REQUESTED") {
      this.selectedMarkerId = $event.messgae;
      this.selectedTriviaId = $event.triviaId;
      this.tabView = "PLAY_TRIVIA";
    } else if ($event.status === "START_FIND_VOUCHER_AR") {
      this.tabView = "FIND_VOUCHER_AR_VIEW";
      this.selectedMarker = $event.messgae;
    }
    this.addToHistory(this.tabView);
  }

  onCollectEvent($event: any) {
    alert("In Landing Page");
    this.selectedVoucherId = $event.voucherId;
    this.selectedMarkerId = $event.id;
    this.tabView = "VOUCHER_COLLECT_VIEW";
  }
}
