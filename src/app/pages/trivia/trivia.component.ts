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
  @Input()
  participateId: string;
  selectTrivia: any;
  @Output()
  completeEvent = new EventEmitter<any>();
  currentQuestion: number;
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService) { }

  ngOnInit(): void {
    this.currentQuestion = 1;
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
        this.selectTrivia = response.data;
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  markSelect(option: any) {
    option.selected = true;
    if (this.currentQuestion < this.selectTrivia.questions.length) {
      this.processNextQuestion();
      return;
    }
    this.processCompleteTrivia();
  }

  processNextQuestion() {
    setTimeout(() => {
      this.currentQuestion = this.currentQuestion + 1;
    }, 500);
  }

  processCompleteTrivia() {
    this.loadingService.show();
    const input = {} as any;
    input.id = this.participateId;
    input.trivia = this.triviaId;
    input.questions = new Array<any>();
    this.selectTrivia.questions.forEach((question: any) => {
      const temp = {} as any;
      temp.id = question.id;
      const selectedOption = question.options.find((x: any) => x.selected);
      if (selectedOption) {
        temp.responseId = selectedOption.id;
        input.questions.push(temp);
      }
    });
    if (input.questions.length <= 0) {
      this.toastService.error("Please answer alteast one question");
      return;
    }
    this.mapService.completeTrivia(input)
      .then((response: RestResponse) => {
        this.loadingService.hide();
        if (!response.status) {
          this.toastService.error(response.message);
          this.nextPage();
          return;
        }
        this.toastService.success(response.message);
        this.nextPage();
      }, (error: any) => {
        this.loadingService.hide();
        this.toastService.error(error.message);
      });
  }

  nextPage() {
    setTimeout(() => {
      this.completeEvent.emit({ "status": "FIND_VOUCHER_REQUESTED", "messgae": "" });
    }, 200);
  }
}
