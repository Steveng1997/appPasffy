import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Model
import { ModelManager } from 'src/app/core/models/manager';

// Services
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-recover-pass',
  templateUrl: './recover-pass.page.html',
  styleUrls: ['./recover-pass.page.scss'],
})
export class RecoverPassPage implements OnInit {

  email = ""

  manager: ModelManager = {
    password: "",
  }

  constructor(public router: Router,
    private managerService: ManagerService
  ) { }

  ngOnInit() {
  }

  recover() {
    if (this.email) {
      if (this.manager.password) {
        this.managerService.email(this.email).subscribe((rp: any) => {
          if (rp.length != 0) {
            this.managerService.update(Number(rp[0].id), this.manager).subscribe((resp: any) => {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Se actualizo correctamente el password!', showConfirmButton: false, timer: 1500 })
              this.login()
            })
          } else {
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'Ya existe ningun correo', showConfirmButton: false, timer: 1000 })
          }
        })
      } else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo de la contraseña se encuentra vacío', showConfirmButton: false, timer: 1000 })
      }
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del correo se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  login() {
    location.replace(``)
  }
}
