import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {

  categories: Array<any>;
  constructor(private _dataService: DataService,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _localStorageService: LocalStorageService,
    private _router: Router) { }

  ngOnInit(): void {
    this.fetchCompanies();
  }

  fetchCompanies() {
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
        })
      }, (error) => {
        this._loadingService.hide();
        this._toastService.error(error.messagge);
      });
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
    const customerCategories = new Array<any>();
    selectedCategories.forEach((category) => {
      customerCategories.push({ "categoryId": category.id });
    })
    this._loadingService.show();
    this._dataService.saveCategories({ "customerCategories": customerCategories })
      .then((response: RestResponse) => {
        this._loadingService.hide();
        if (!response.status) {
          this._toastService.error(response.message);
          return;
        }
        this._toastService.success("Interest Successfully Updated");
        this._localStorageService.set('user', this._localStorageService.get('temp-user'));
        this._localStorageService.set('token', this._localStorageService.get('temp-token'));
        this._localStorageService.remove('temp-user');
        this._localStorageService.remove('temp-token');
        setTimeout(() => {
          this._router.navigateByUrl(`/dashboard`);
        }, 1000);
      }, (error) => {
        this._loadingService.hide();
        this._toastService.error(error.messagge);
      });
  }
}
