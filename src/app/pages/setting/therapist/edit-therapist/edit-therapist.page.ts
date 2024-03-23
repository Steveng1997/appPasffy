import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';

// Service
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';

@Component({
  selector: 'app-edit-therapist',
  templateUrl: './edit-therapist.page.html',
  styleUrls: ['./edit-therapist.page.scss'],
})

export class EditTherapistPage implements OnInit {

  therap: any
  id: any
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
    propina: "100",
    salida: "",
    servicio: "50",
    tabaco: "",
    vitamina: "",
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceTherapist: TherapistService
  ) { }

  ngOnInit() {
    const params = this.activeRoute.snapshot.params
    this.id = Number(params['id'])

    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']

    this.serviceTherapist.getByIdTerapeuta(this.id).subscribe((rp) => {
      return (this.therap = rp)
    })
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

  update(id: number, terapeuta) {
    if (this.therapist.nombre != "") {
      this.validate()
      this.serviceTherapist.update(id, terapeuta).subscribe((resp => {
        if (resp = true) {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
          this.router.navigate([`tabs/${this.iduser}/setting`])
        }
      }))
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  delete(id: number, nombre: string) {
    Swal.fire({
      heightAuto: false,
      title: '¿Deseas eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceTherapist.deleteTerapeuta(id).subscribe((resp => {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
          this.router.navigate([`tabs/${this.iduser}/setting`])
        }))
      }
    })
  }

  close() {
    this.router.navigate([`tabs/${this.iduser}/setting`])
  }
}