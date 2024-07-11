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
    activo: true,
    bebida: "0",
    bebidaTerap: "0",
    fijoDia: "0",
    id: 0,
    nombre: "",
    otros: "0",
    pass: "",
    propina: "0",
    rol: "",
    servicio: "0",
    tabaco: "0",
    usuario: "",
    vitamina: "0"
  }

  constructor(public router: Router) { }

  onLogin() {
    location.replace(`screen/${this.manager.pass}/${this.manager.usuario}`)
  }

  register() {
    location.replace(`register`)
  }

  recover() {
    location.replace(`recover`)
  }
}