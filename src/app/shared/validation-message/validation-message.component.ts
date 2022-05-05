import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.scss']
})
export class ValidationMessageComponent implements OnInit {

  @Input() field: any;
  @Input() onClickValidation: boolean;
  @Input() customErrorMessage: string;
  @Input() comparableField: any;
  @Input() type: string;

  constructor() {
  }

  ngOnInit() {
  }
}
