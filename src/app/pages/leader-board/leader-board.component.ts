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
  constructor(private dataService: DataService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    public authService: AuthService) { }

  ngOnInit(): void {
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
    this.dataService.fetchLeaderboards(this.filterParam)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }

        if (response.data.length > 3) {
          this.topUsers.push(response.data[1]);
          this.topUsers.push(response.data[0]);
          this.topUsers.push(response.data[2]);
        } if (response.data.length === 2) {
          this.topUsers.push(response.data[1]);
          this.topUsers.push(response.data[0]);
        } else {
          this.topUsers = response.data.slice(0, response.data.length);
        }
        if (response.data.length > 3) {
          this.records = response.data.slice(3);
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
  }
}
