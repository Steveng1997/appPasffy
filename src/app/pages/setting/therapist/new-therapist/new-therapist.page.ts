import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from "dayjs";

// Services
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-new-therapist',
  templateUrl: './new-therapist.page.html',
  styleUrls: ['./new-therapist.page.scss'],
})

export class NewTherapistPage implements OnInit {
  iduser: number

  therapist: ModelTherapist = {
    active: true,
    company: "",
    dateEnd: "",
    drink: 0,
    drinkTherapist: 50,
    exit: "",
    minutes: 0,
    name: "",
    others: 0,
    service: 50,
    tabacco: 0,
    tip: 50,
    vitamin: 0
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private ionLoaderService: IonLoaderService
  ) { }

  ngOnInit(): void {
    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']
  }

  resetTherapist() {
    if (this.therapist.name != '') this.therapist.name = ''
    if (this.therapist.service > 0) this.therapist.service = 50
    if (this.therapist.drink > 0) this.therapist.drink = 0
    if (this.therapist.drinkTherapist > 0) this.therapist.drinkTherapist = 50
    if (this.therapist.tabacco > 0) this.therapist.tabacco = 0
    if (this.therapist.vitamin > 0) this.therapist.vitamin = 0
    if (this.therapist.tip > 0) this.therapist.tip = 100
    if (this.therapist.others > 0) this.therapist.others = 0
  }

  save() {
    if (this.therapist.name != '') {
      this.ionLoaderService.simpleLoader()
      this.therapist.name = this.therapist.name.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

      this.serviceManager.getId(Number(this.iduser)).subscribe((rp: any) => {
        this.therapist.company = rp['manager'].company

        this.serviceTherapist.name(this.therapist.name).subscribe((rp: any) => {
          if (rp['therapist'].length != 0) {

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
