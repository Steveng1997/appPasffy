import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';

// Model
import { ModelManager } from 'src/app/core/models/manager';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

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
    rol: "Administrador",
    service: 0,
    tabacco: 0,
    tip: 0,
    vitamin: 0
  }

  constructor(
    public router: Router,
    private serviceManager: ManagerService,
    private ionLoaderService: IonLoaderService
  ) { }

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
    if (this.manager.email) {
      if (this.manager.password) {
        this.ionLoaderService.simpleLoader()
        this.serviceManager.email(this.manager.email).subscribe((rp: any) => {
          if (rp['manager'].length == 0) {
            this.createUniqueId()
            this.serviceManager.save(this.manager).subscribe((rp: any) => {
              this.ionLoaderService.dismissLoader()
              this.login()
            }, err => {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'La contraseña debe tener minimo 5 caracteres', showConfirmButton: false, timer: 1000 })
              this.ionLoaderService.dismissLoader()
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
  }

  login() {
    location.replace(``)
  }
}