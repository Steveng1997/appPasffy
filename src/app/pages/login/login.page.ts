import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Model
import { ModelManager } from 'src/app/core/models/manager';

// Services
import { LoginService } from 'src/app/core/services/login/login.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

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

  constructor(
    public router: Router,
    private ionLoaderService: IonLoaderService,
    private serviceLogin: LoginService
  ) { }

  dateTpm() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.dateTmp = `${dia}/${convertMes}/${año}`
    } else {
      convertMes = mes.toString()
      this.dateTmp = `${dia}/${mes}/${año}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.dateTmp = `${convertDia}/${convertMes}/${año}`
    } else {
      convertDia = dia.toString()
      this.dateTmp = `${dia}/${convertMes}/${año}`
    }
  }

  onLogin() {
    if (this.manager.usuario != "") {
      if (this.manager.pass != "") {
        this.ionLoaderService.simpleLoader()
        this.serviceLogin.getByUsuario(this.manager.usuario).subscribe((resp: any) => {
          if (resp.length > 0) {
            if (resp[0]['activo'] == true) {
              this.serviceLogin.getByUserAndPass(this.manager.usuario, this.manager.pass).subscribe((rp: any) => {
                if (rp.length > 0) {
                  this.dateTpm()
                  this.ionLoaderService.dismissLoader()
                  location.replace(`tabs/${resp[0].id}/vision`)
                } else {
                  Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'La contraseña es incorrecta' })
                }
              })
            } else {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Este usuario ya no esta trabajando con nosotros' })
            }
          } else {
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No existe este usuario en la base de datos' })
          }
        })
      }
      else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo de la contraseña se encuentra vacío' })
      }
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo del usuario se encuentra vacío' })
    }
  }

  register() {
    this.router.navigate([`register`])
  }
}