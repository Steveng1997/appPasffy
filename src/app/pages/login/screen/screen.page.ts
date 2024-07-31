import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Services
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.page.html',
  styleUrls: ['./screen.page.scss'],
})
export class ScreenPage implements OnInit {

  email = ''
  password = ''

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceManager: ManagerService
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.email = params['email']
    this.password = params['password']
    this.login()
  }

  login() {
    if (this.email) {
      if (this.password) {
        this.serviceManager.email(this.email).subscribe((rp: any) => {
          if (rp['manager'].length > 0) {

            if (rp['manager'][0].expiration == true)
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Dentro de 15 dias se termina lo gratuito' })

            if (rp['manager'][0]['active'] == true) {
              this.serviceManager.getEmailWithPassword(this.email, this.password).subscribe((rp: any) => {
                if (rp['manager'].length > 0) {
                  setTimeout(() => { location.replace(`tabs/${rp['manager'][0].id}/vision`) }, 1500);
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
