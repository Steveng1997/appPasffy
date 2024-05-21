import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';

@Component({
  selector: 'app-new-therapist',
  templateUrl: './new-therapist.page.html',
  styleUrls: ['./new-therapist.page.scss'],
})

export class NewTherapistPage implements OnInit {
  iduser: number

  therapist: ModelTherapist = {
    activo: true,
    bebida: "",
    bebidaTerap: "50",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    minuto: 0,
    nombre: "",
    otros: "",
    propina: "50",
    salida: "",
    servicio: "50",
    tabaco: "",
    vitamina: "",
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private ionLoaderService: IonLoaderService
  ) { }

  ngOnInit(): void {
    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']
  }

  validate() {
    if (this.therapist.bebida == "") this.therapist.bebida = "0"
    if (this.therapist.bebidaTerap == "") this.therapist.bebidaTerap = "0"
    if (this.therapist.otros == "") this.therapist.otros = "0"
    if (this.therapist.propina == "") this.therapist.propina = "0"
    if (this.therapist.servicio == "") this.therapist.servicio = "0"
    if (this.therapist.tabaco == "") this.therapist.tabaco = "0"
    if (this.therapist.vitamina == "") this.therapist.vitamina = "0"
  }

  resetTherapist() {
    if (this.therapist.nombre != '') this.therapist.nombre = ''
    if (Number(this.therapist.servicio) > 0) this.therapist.servicio = "50"
    if (Number(this.therapist.bebida) > 0) this.therapist.bebida = ""
    if (Number(this.therapist.bebidaTerap) > 0) this.therapist.bebidaTerap = "50"
    if (Number(this.therapist.tabaco) > 0) this.therapist.tabaco = ""
    if (Number(this.therapist.vitamina) > 0) this.therapist.vitamina = ""
    if (Number(this.therapist.propina) > 0) this.therapist.propina = "100"
    if (Number(this.therapist.otros) > 0) this.therapist.otros = ""
  }

  save() {
    if (this.therapist.nombre != '') {
      this.ionLoaderService.simpleLoader()
      this.therapist.nombre = this.therapist.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.validate()

      this.serviceTherapist.getTerapeuta(this.therapist.nombre).subscribe((rp: any) => {
        if (rp.length != 0) {

          Swal.fire({ heightAuto: false, title: 'Ya hay una persona con ese nombre, desea agregar este nombre?', showDenyButton: true, confirmButtonText: 'Si', denyButtonText: `No` }).then((result) => {

            if (result.isConfirmed) {
              this.serviceTherapist.save(this.therapist).subscribe((rp) => {
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1000 })
                this.resetTherapist()
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.iduser}/therapist`);
              })
            } else {
              this.ionLoaderService.dismissLoader()
            }
          })
        } else {
          this.serviceTherapist.save(this.therapist).subscribe((rp) => {
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1000 })
            this.resetTherapist()
            this.ionLoaderService.dismissLoader()
            location.replace(`tabs/${this.iduser}/therapist`);
          })
        }
      })
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío' })
    }
  }

  close() {
    this.resetTherapist()
    this.router.navigate([`tabs/${this.iduser}/therapist`])
  }

  clean() {
    this.resetTherapist()
  }
}
