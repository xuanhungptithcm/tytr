import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { LocalStorageService } from 'angular-2-local-storage/dist/local-storage.service';
import { ToastsManager } from 'ng2-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private name = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  private email = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  private password = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);
  private repassword = new FormControl('', [
    Validators.required,
    Validators.minLength(5)
  ]);

  private registerGroup: FormGroup = this.builder.group({
    name: this.name,
    email: this.email,
    password: this.password
  });

  constructor(private builder: FormBuilder, private http: Http, private router: Router
    , private localstoage: LocalStorageService, private toastr: ToastsManager, private vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
  }

  doRegister() {
    this.http.post('http://localhost:3000/register', { register: this.registerGroup.value }).subscribe(user => {
      if (user.json().user) {
        this.localstoage.add('user', user.json().user);
        this.router.navigate(['./layout/message']);
      } else {
        this.toastr.error('Email Has Been Used!', 'Oops!');
      }
    });
  }

  returnLogin() {
    this.router.navigate(['./']);
  }
}
