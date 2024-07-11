import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Model
import { ModelManager } from 'src/app/core/models/manager';

// Services
import { LoginService } from 'src/app/core/services/login/login.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.page.html',
  styleUrls: ['./screen.page.scss'],
})
export class ScreenPage implements OnInit {

  dateTmp = ''
  email = ''
  pass = ''

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceLogin: LoginService
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.email = params['email']
    this.pass = params['pass']
    this.login()
  }

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

  login() {
    if (this.email) {
      if (this.pass) {
        this.serviceLogin.getByUsuario(this.email).subscribe((resp: any) => {
          if (resp.length > 0) {
            if (resp[0]['activo'] == true) {
              this.serviceLogin.getByUserAndPass(this.email, this.pass).subscribe((rp: any) => {
                if (rp.length > 0) {
                  this.dateTpm()
                  setTimeout(() => { location.replace(`tabs/${resp[0].id}/vision`) }, 1500);
                } else {
                  setTimeout(() => {
                    this.router.navigate(['']);
                    Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'La contraseña es incorrecta' })
                  }, 1500);
                }
              })
            } else {
              setTimeout(() => {
                this.router.navigate(['']);
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Este usuario ya no esta trabajando con nosotros' })
              }, 1500);
            }
          } else {
            setTimeout(() => {
              this.router.navigate(['']);
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No existe este usuario en la base de datos' })
            }, 1500);
          }
        })
      }
      else {
        setTimeout(() => {
          this.router.navigate(['']);
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo de la contraseña se encuentra vacío' })
        }, 1500);
      }
    } else {
      setTimeout(() => {
        this.router.navigate(['']);
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo del usuario se encuentra vacío' })
      }, 1500);
    }
  }
}
