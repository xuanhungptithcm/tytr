import { UserService } from './../bank-forder/service-all/services/user.service';

import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { LocalStorageService } from 'angular-2-local-storage/dist/local-storage.service';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);

  pass = new FormControl('', [Validators.required]);
  private loginForm: FormGroup = this.builder.group({
    email: this.email,
    pass: this.pass
  });
  private flag: Boolean = false;
  constructor(private router: Router, private toastr: ToastsManager
    , private vcr: ViewContainerRef, private localstoage: LocalStorageService
    , private useservice: UserService, private builder: FormBuilder) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    const login = this.localstoage.get('user');
    if (login) {
      this.router.navigate(['./layout/message']);
    }
  }

  login () {
    // Attempt Logging in...
    this.doLogin(this.loginForm.value);
  }

  doLogin(loginForm) {
    this.flag = true;
    this.useservice.getUserLogin(loginForm).subscribe(user => {
      if (user) {
        this.flag = true;
        this.localstoage.add('user', user);
        this.router.navigate(['./layout/message']);
      } else {
        this.flag = false;
        this.toastr.error('Đăng Nhập Không Thành Công!', 'Oops!');
      }
    });
  }
}
