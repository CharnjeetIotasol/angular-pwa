import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AgmOverlays } from "agm-overlays";
import { FileUploadModule } from 'ng2-file-upload';
import { NgxBarcodeModule } from 'ngx-barcode';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ImageCropperModule } from 'ngx-image-cropper';
import { HttpLoaderFactory } from 'src/app/app.module';
import { MaterialAppModule } from 'src/app/material.module';
import { FileCropperComponent } from 'src/app/shared/file-cropper/file-cropper.component';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { FindVoucherArComponent } from '../find-voucher-ar/find-voucher-ar.component';
import { FindVoucherComponent } from '../find-voucher/find-voucher.component';
import { InterestComponent } from '../interest/interest.component';
import { LandingComponent } from '../landing/landing.component';
import { LeaderBoardComponent } from '../leader-board/leader-board.component';
import { MyVouchersComponent } from '../my-vouchers/my-vouchers.component';
import { ProfileComponent } from '../profile/profile.component';
import { TriviaComponent } from '../trivia/trivia.component';
import { VoucherCollectDetailComponent } from '../voucher-collect-detail/voucher-collect-detail.component';
import { VoucherDetailComponent } from '../voucher-detail/voucher-detail.component';
import { LayoutComponent } from './layout.component';
import { LAYOUTROUTING } from './layout.routing';

@NgModule({
  declarations: [
    LayoutComponent,
    LandingComponent,
    ProfileComponent,
    ChangePasswordComponent,
    InterestComponent,
    FileCropperComponent,
    LeaderBoardComponent,
    FindVoucherComponent,
    TriviaComponent,
    VoucherCollectDetailComponent,
    VoucherDetailComponent,
    MyVouchersComponent,
    FindVoucherArComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialAppModule,
    SharedModuleModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(LAYOUTROUTING),
    AgmOverlays,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyApoDaDS76qQ-1hMuVMIOx63AwSW85EZhE'
    }),
    GooglePlaceModule,
    FileUploadModule,
    ImageCropperModule,
    NgxBarcodeModule
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule {
}
