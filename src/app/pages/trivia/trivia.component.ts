import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-trivia',
  templateUrl: './trivia.component.html',
  styleUrls: ['./trivia.component.scss']
})
export class TriviaComponent implements OnInit {

  @Input()
  triviaId: string;
  trivia: any;
  @Output()
  completeEvent = new EventEmitter<any>();
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.fetchTriviaDetail();
  }

  fetchTriviaDetail() {
    this.loadingService.show();
    this.mapService.fetchTriviaDetail(this.triviaId)
      .subscribe((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        console.log(response.data);
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

}
