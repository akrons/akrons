import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'akrons-auth-backend-user-password-feedback',
  templateUrl: './user-password-feedback.component.html',
  styleUrls: ['./user-password-feedback.component.css']
})
export class UserPasswordFeedbackComponent implements OnInit {

  @Input()
  login: string;

  @Input()
  password: string;

  @Input()
  id: string;

  constructor() { }

  ngOnInit(): void {
  }

}
