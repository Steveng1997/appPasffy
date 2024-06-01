import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { LoginService } from 'src/app/core/services/login/login.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

// Model
import { ModelManager } from 'src/app/core/models/manager';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

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

  constructor(
    public router: Router,
    private serviceLogin: LoginService,
    private ionLoaderService: IonLoaderService
  ) { }

  resetTherapist() {
    if (this.manager.nombre != '') this.manager.nombre = ''
    if (this.manager.usuario != '') this.manager.usuario = ''
    if (this.manager.pass != '') this.manager.pass = ''
    if (Number(this.manager.fijoDia) > 0) this.manager.fijoDia = ''
    if (Number(this.manager.servicio) > 0) this.manager.servicio = ''
    if (Number(this.manager.bebida) > 0) this.manager.bebida = ''
    if (Number(this.manager.bebidaTerap) > 0) this.manager.bebidaTerap = ''
    if (Number(this.manager.tabaco) > 0) this.manager.tabaco = ''
    if (Number(this.manager.vitamina) > 0) this.manager.vitamina = ''
    if (Number(this.manager.propina) > 0) this.manager.propina = ''
    if (Number(this.manager.otros) > 0) this.manager.otros = ''
  }

  validateEmpty() {
    if (this.manager.bebida == "") this.manager.bebida = "0"
    if (this.manager.bebidaTerap == "") this.manager.bebidaTerap = "0"
    if (this.manager.fijoDia == "") this.manager.fijoDia = "0"
    if (this.manager.otros == "") this.manager.otros = "0"
    if (this.manager.propina == "") this.manager.propina = "0"
    if (this.manager.servicio == "") this.manager.servicio = "0"
    if (this.manager.tabaco == "") this.manager.tabaco = "0"
    if (this.manager.vitamina == "") this.manager.vitamina = "0"
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    return this.manager.company = uuid
  }

  save() {
    if (this.manager.nombre) {
      if (this.manager.usuario) {
        if (this.manager.pass) {
          this.ionLoaderService.simpleLoader()
          this.serviceLogin.getByUsuario(this.manager.usuario).subscribe((nameRegistro: any) => {
            if (nameRegistro.length == 0) {
              this.manager.nombre = this.manager.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
              this.validateEmpty()
              this.createUniqueId()
              this.serviceLogin.registerEncargada(this.manager).subscribe((resp: any) => {
                this.resetTherapist()
                this.ionLoaderService.dismissLoader()
                this.router.navigate([``])
              })
            } else {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'Ya existe este usuario', showConfirmButton: false, timer: 1000 })
              this.ionLoaderService.dismissLoader()
            }
          })
        } else {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo de la contraseña se encuentra vacío', showConfirmButton: false, timer: 1000 })
        }
      } else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del usuario se encuentra vacío', showConfirmButton: false, timer: 1000 })
      }

    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  clean() {
    this.resetTherapist()
  }

  back() {
    this.resetTherapist()
    this.router.navigate([``])
  }
}