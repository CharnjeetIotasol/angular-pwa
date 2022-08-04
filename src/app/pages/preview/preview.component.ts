import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  primaryColor: string;
  textColor: string;
  brandingName: string;
  logoPath: string;
  isPartnerView: boolean;
  isVoucherView: boolean;
  constructor(private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.isVoucherView = this.router.url.startsWith("/app/voucher/preview");
    this.isPartnerView = this.router.url.startsWith("/app/partner/preview");
    this.route.queryParams.subscribe(params => {
      this.primaryColor = params.primaryColor ? `#${params.primaryColor}` : "#1e006d";
      this.textColor = params.textColor ? `#${params.textColor}` : "#fff";
      this.brandingName = params.brandingName ? params.brandingName : "Preview Application";
      this.logoPath = params.logoPath ? params.logoPath : "/assets/icons/icon-96x96.png";
    });
  }
}
