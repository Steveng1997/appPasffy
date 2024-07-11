import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { LoginService } from 'src/app/core/services/login/login.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ModelManager } from 'src/app/core/models/manager';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.page.html',
  styleUrls: ['./recover-pass.page.scss'],
})
export class RecoverPassPage implements OnInit {

  manager: ModelManager = {
    activo: true,
    bebida: "",
    bebidaTerap: "",
    company: "",
    fijoDia: "",
    id: 0,
    nombre: "",
    otros: "",
    pass: "",
    propina: "",
    rol: "administrador",
    servicio: "",
    tabaco: "",
    usuario: "",
    vitamina: ""
  }

  constructor() { }

  ngOnInit() {
  }

  save() {

  }

  login() { }
}
