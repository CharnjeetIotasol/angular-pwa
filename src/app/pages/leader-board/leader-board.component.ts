import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { AuthService } from 'src/app/shared/auth.services';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit {

  state: string;
  records: Array<any>;
  topUsers: Array<any>;
  filterParam: any;
  myDetail: any;
  partnerDetail: any;
  constructor(private dataService: DataService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    public authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isPartnerUser()) {
      this.partnerDetail = this.authService.getPartnerDetail();
    }
    this.myDetail = this.authService.getUser();
    this.state = "CURRENT_MONTH";
    this.records = new Array<any>();
    this.filterParam = {} as any;
    this.setCurrentMonthFilter();
    this.fetchLeaderboards();
  }

  setCurrentMonthFilter() {
    const currentDate = new Date();
    this.filterParam.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    this.filterParam.startDate.setHours(12, 0, 0);
    this.filterParam.endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.filterParam.endDate.setHours(12, 0, 0);
  }

  fetchLeaderboards() {
    this.loadingService.show();
    this.records = new Array<any>();
    this.topUsers = new Array<any>();
    if (this.authService.isPartnerUser()) {
      this.filterParam.partner = this.partnerDetail.id;
    }
    this.dataService.fetchLeaderboards(this.filterParam)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }

        const records: Array<any> = response.data;
        if (records.length >= 3) {
          this.topUsers.push(records.find(x => x.rank === 2));
          this.topUsers.push(records.find(x => x.rank === 1));
          this.topUsers.push(records.find(x => x.rank === 3));
        } if (response.data.length === 2) {
          this.topUsers.push(records.find(x => x.rank === 2));
          this.topUsers.push(records.find(x => x.rank === 1));
        } else if (response.data.length === 1) {
          this.topUsers = records.slice(0, response.data.length);
        }
        if (records.length > 3) {
          this.records = records.slice(3);
        }
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  toggle() {
    this.state = this.state === "CURRENT_MONTH" ? "OVERALL" : "CURRENT_MONTH";
    if (this.state === 'OVERALL') {
      this.filterParam.startDate = undefined;
      this.filterParam.endDate = undefined;
    } else {
      this.setCurrentMonthFilter();
    }
    this.fetchLeaderboards();
  }
}
