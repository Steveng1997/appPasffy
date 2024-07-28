import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { ModelManager } from 'src/app/core/models/manager';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  dateTmp = ''
  login: boolean = false
  registre: boolean = false
  amount: number = 0

  manager: ModelManager = {
    active: true,
    company: "",
    drink: 0,
    drinkTherapist: 0,
    email: "",
    expiration: false,
    fixeDay: 0,
    name: "",
    others: 0,
    password: "",
    rol: "",
    service: 0,
    tabacco: 0,
    tip: 0,
    vitamin: 0
  }

  constructor(public router: Router) { }

  onLogin() {
    location.replace(`screen/${this.manager.password}/${this.manager.email}`)
  }

  register() {
    location.replace(`register`)
  }

  recover() {
    location.replace(`recover`)
  }
}