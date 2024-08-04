import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from "dayjs";

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';
import { ModelService } from 'src/app/core/models/service';

// Service
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ServiceService } from 'src/app/core/services/service/service.service';
import { ServiceLiquidationTherapist } from 'src/app/core/services/liquidation/service-liquidation-therapist.service';

@Component({
  selector: 'app-edit-therapist',
  templateUrl: './edit-therapist.page.html',
  styleUrls: ['./edit-therapist.page.scss'],
})

export class EditTherapistPage implements OnInit {
  therapist = [];
  id: any
  iduser: number
  currentDate = new Date().getTime()
  company: string

  therapistModel: ModelTherapist = {
    active: true,
    company: "",
    dateEnd: '',
    drink: 0,
    drinkTherapist: 50,
    exit: "",
    minutes: 0,
    name: "",
    others: 0,
    service: 50,
    tabacco: 0,
    tip: 100,
    updated_at: dayjs().format("YYYY-MM-DD"),
    vitamin: 0
  }

  liquidationTherapist: LiquidationTherapist = {
    amount: 0,
    company: "",
    currentDate: 0,
    dateStart: "",
    dateEnd: dayjs().format("YYYY-MM-DD HH:mm"),
    therapist: "",
    treatment: 0,
    uniqueId: "",
    idTherap: ""
  }

  modelService: ModelService = {
    idTherap: "",
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private serviceTherapist: TherapistService,
    public service: ServiceService,
    private serviceLiquidationTherapist: ServiceLiquidationTherapist
  ) { }

  ngOnInit(): void {
    const params = this.activeRoute.snapshot.params
    this.id = Number(params['id'])

    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']

    this.serviceTherapist.getId(this.id).subscribe((rp) => {
      this.company = rp['therapist'].company
      this.therapist = [rp['therapist']]
    })
  }

  async getTerapLiquidation(nombre) {
    await this.service.getByTherapistNotLiquidatedTherapist(nombre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.liquidationTherapist.treatment = rp.length
        this.modelService.liquidatedTherapist = true

        for (let i = 0; i < rp.length; i++) {
          this.service.updateLiquidatedTherapist(rp[i]['id'], this.modelService).subscribe((rp) => { })
        }
      }
    })
  }

  async date(name: string) {
    let untilYear = "", untilMonth = "", untilDay = ""

    this.serviceLiquidationTherapist.getByTherapAndCompany(name, this.company).subscribe(async (rp: any) => {
      if (rp['liquidTherapist'].length > 0) {
        untilYear = rp['liquidTherapist'][0].dateEnd.toString().substring(2, 4)
        untilMonth = rp['liquidTherapist'][0].dateEnd.toString().substring(5, 7)
        untilDay = rp['liquidTherapist'][0].dateEnd.toString().substring(8, 10)
        this.liquidationTherapist.dateStart = `${untilYear}-${untilMonth}-${untilDay}`
        this.liquidationTherapist.dateStart = rp['liquidTherapist'][0].dateEnd
      } else {
        this.service.getByTherapistNotLiquidatedTherapist(name).subscribe(async (rp: any) => {
          if (rp['service'].length > 0) {
            untilYear = rp['service'][0]['dateToday'].substring(0, 4)
            untilMonth = rp['service'][0]['dateToday'].substring(5, 7)
            untilDay = rp['service'][0]['dateToday'].substring(8, 10)
            this.liquidationTherapist.dateStart = `${untilYear}-${untilMonth}-${untilDay}`
            this.liquidationTherapist.dateStart = rp['liquidTherapist'][0].dateEnd
          }
          else {
            this.liquidationTherapist.dateStart = dayjs().format("YYYY-MM-DD HH:mm")
          }
        })
      }
    })
  }

  createIdUnique() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelService.idTherap = uuid
    this.liquidationTherapist.uniqueId = uuid
    this.liquidationTherapist.idTherap = uuid
    return this.liquidationTherapist.uniqueId
  }

  async delete(id: number, name: string) {
    this.serviceTherapist.getId(id).subscribe((rp: any) => {
      if (rp) {
        Swal.fire({
          heightAuto: false,
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.ionLoaderService.simpleLoader()
            this.liquidationTherapist.currentDate = this.currentDate
            this.liquidationTherapist.therapist = name
            this.liquidationTherapist.company = this.company
            this.createIdUnique()
            await this.date(name)
            await this.getTerapLiquidation(name)

            this.serviceTherapist.delete(id).subscribe(async (rp: any) => {
              this.serviceLiquidationTherapist.save(this.liquidationTherapist).subscribe(async (rp) => {
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.iduser}/therapist`);
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
              })
            })
          }
        })
      }
    })
  }

  async update(id: number, therapist) {
    if (therapist.name != "") {
      this.ionLoaderService.simpleLoader()
      this.serviceTherapist.update(id, therapist).subscribe(async (res: any) => {
        this.ionLoaderService.dismissLoader()
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
        location.replace(`tabs/${this.iduser}/therapist`);
      })
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  close() {
    this.router.navigate([`tabs/${this.iduser}/therapist`])
  }
}