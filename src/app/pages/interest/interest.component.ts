import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss']
})
export class InterestComponent implements OnInit {

  categories: Array<any>;
  myInterests: Array<any>;
  @Output()
  completeEvent = new EventEmitter<any>();
  constructor(private _dataService: DataService,
    private _toastService: ToastService,
    private _loadingService: LoadingService) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.fetchMyInterests()
  }

  fetchMyInterests() {
    this.myInterests = new Array<any>();
    this._loadingService.show();
    this._dataService.fetchMyCategories()
      .subscribe((response: RestResponse) => {
        this._loadingService.hide();
        if (!response.status) {
          this._toastService.error(response.message);
          return;
        }
        this.myInterests = response.data;
        this.processInterests();
      }, (error) => {
        this._loadingService.hide();
        this._toastService.error(error.messagge);
      });
  }

  fetchCategories() {
    this.categories = new Array<any>();
    this._loadingService.show();
    this._dataService.fetchCategories()
      .then((response: RestResponse) => {
        this._loadingService.hide();
        if (!response.status) {
          this._toastService.error(response.message);
          return;
        }
        this.categories = response.data;
        this.categories.forEach((category) => {
          category.selected = false;
        });
        this.processInterests();
      }, (error) => {
        this._loadingService.hide();
        this._toastService.error(error.messagge);
      });
  }

  processInterests() {
    if (this.categories.length <= 0 && this.myInterests.length <= 0) {
      return;
    }
    this.categories.forEach((category) => {
      category.selected = this.myInterests.find(x => x.categoryId === category.id);
    })
  }
  toggleCategory(category: any) {
    category.selected = !category.selected;
  }

  complete() {
    const selectedCategories = this.categories.filter(x => x.selected);
    if (selectedCategories.length <= 0) {
      this._toastService.error("Please select atleast one interest")
      return;
    }
    //Remove any existing selected interest
    this.myInterests.forEach((interest: any) => {
      const hasExist = selectedCategories.find(x => x.id === interest.categoryId)
      if (!hasExist) {
        interest.isDeleted = true;
      }
    });

    //Add newly added interest
    selectedCategories.forEach((category) => {
      const isExist = this.myInterests.find(x => x.categoryId === category.id);
      if (!isExist) {
        this.myInterests.push({ "categoryId": category.id });
      }
    })
    this._loadingService.show();
    this._dataService.saveCategories({ "customerCategories": this.myInterests })
      .then((response: RestResponse) => {
        this._loadingService.hide();
        if (!response.status) {
          this._toastService.error(response.message);
          return;
        }
        this._toastService.success("Interest saved successfully");
        this.completeEvent.emit({ "status": "COMPLETED", "messgae": "" });
      }, (error: any) => {
        this._loadingService.hide();
        this._toastService.error(error.messagge);
      });
  }
}
