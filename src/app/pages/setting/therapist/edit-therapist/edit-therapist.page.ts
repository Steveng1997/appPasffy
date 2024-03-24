import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

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

  therapist: any
  id: any
  iduser: number
  currentDate = new Date().getTime()

  therapistModel: ModelTherapist = {
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

  liquidationTherapist: LiquidationTherapist = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    createdDate: "",
    id: 0,
    idUnico: "",
    idTerapeuta: "",
    importe: 0,
    terapeuta: "",
    tratamiento: 0
  }

  modelService: ModelService = {
    idTerapeuta: "",
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

    this.serviceTherapist.getByIdTerapeuta(this.id).subscribe((rp) => {
      return (this.therapist = rp)
    })
  }

  validate() {
    if (this.therapistModel.bebida == "") this.therapistModel.bebida = "0"
    if (this.therapistModel.bebidaTerap == "") this.therapistModel.bebidaTerap = "0"
    if (this.therapistModel.otros == "") this.therapistModel.otros = "0"
    if (this.therapistModel.propina == "") this.therapistModel.propina = "0"
    if (this.therapistModel.servicio == "") this.therapistModel.servicio = "0"
    if (this.therapistModel.tabaco == "") this.therapistModel.tabaco = "0"
    if (this.therapistModel.vitamina == "") this.therapistModel.vitamina = "0"
  }

  async getTerapLiquidation(nombre) {
    await this.service.getTerapeutaLiqFalse(nombre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.liquidationTherapist.tratamiento = rp.length

        rp.map(item => {
          this.service.updateLiquidacionTerap(item['id'], this.modelService).subscribe((dates) => { })
        })

        this.serviceLiquidationTherapist.settlementRecord(this.liquidationTherapist).subscribe((save) => { })
      }
    })
  }

  async date(nombre: string) {
    let fromYear = 0, fromYears = '', fromMonth = 0, fromDay = 0, convertMonth = '',
      convertDay = '', untilYear = "", untilMonth = "", untilDay = "", currentDate = new Date()

    fromDay = currentDate.getDate()
    fromMonth = currentDate.getMonth() + 1
    fromYear = currentDate.getFullYear()
    fromYears = fromYear.toString().slice(2, 4)

    if (fromMonth > 0 && fromMonth < 10) {
      convertMonth = '0' + fromMonth
      this.liquidationTherapist.hastaFechaLiquidado = `${fromDay}-${convertMonth}-${fromYears}`
    } else {
      convertMonth = fromMonth.toString()
      this.liquidationTherapist.hastaFechaLiquidado = `${fromDay}-${convertMonth}-${fromYears}`
    }

    if (fromDay > 0 && fromDay < 10) {
      convertDay = '0' + fromDay
      this.liquidationTherapist.hastaFechaLiquidado = `${convertDay}-${convertMonth}-${fromYears}`
    } else {
      this.liquidationTherapist.hastaFechaLiquidado = `${fromDay}-${convertMonth}-${fromYears}`
    }

    this.serviceLiquidationTherapist.consultTherapist(nombre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        untilYear = rp[0]['hastaFechaLiquidado'].toString().substring(2, 4)
        untilMonth = rp[0]['hastaFechaLiquidado'].toString().substring(5, 7)
        untilDay = rp[0]['hastaFechaLiquidado'].toString().substring(8, 10)
        this.liquidationTherapist.desdeFechaLiquidado = `${untilYear}-${untilMonth}-${untilDay}`
        this.liquidationTherapist.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.service.getTerapeutaLiqFalse(nombre).subscribe(async (rp: any) => {
          if (rp.length > 0) {
            untilYear = rp[0]['fechaHoyInicio'].substring(0, 4)
            untilMonth = rp[0]['fechaHoyInicio'].substring(5, 7)
            untilDay = rp[0]['fechaHoyInicio'].substring(8, 10)
            this.liquidationTherapist.desdeFechaLiquidado = `${untilYear}-${untilMonth}-${untilDay}`
            this.liquidationTherapist.desdeHoraLiquidado = rp[0]['horaStart']
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

    this.modelService.idTerapeuta = uuid
    this.liquidationTherapist.idUnico = uuid
    this.liquidationTherapist.idTerapeuta = uuid
    this.modelService.idTerapeuta = uuid
    return this.liquidationTherapist.idUnico
  }

  async dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.liquidationTherapist.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationTherapist.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  async delete(id: number, nombre: string) {
    this.serviceTherapist.getByIdTerapeuta(id).subscribe((rp: any) => {
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
            this.dateCurrentDay()
            this.createIdUnique()
            await this.date(nombre)
            this.liquidationTherapist.currentDate = this.currentDate.toString()
            this.liquidationTherapist.terapeuta = nombre

            await this.getTerapLiquidation(nombre)
            this.serviceTherapist.deleteTerapeuta(id).subscribe(async (rp: any) => {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
              this.ionLoaderService.dismissLoader()
              location.replace(`tabs/${this.iduser}/setting`);
            })
          }
        })
      }
    })
  }

  async update(id: number, terapeuta) {
    if (terapeuta.nombre != "") {
      this.ionLoaderService.simpleLoader()
      this.validate()
      this.serviceTherapist.updateTerapeutas(id, terapeuta).subscribe(async (res: any) => {
        this.ionLoaderService.dismissLoader()
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
        location.replace(`tabs/${this.iduser}/setting`);
      })
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  close() {
    this.router.navigate([`tabs/${this.iduser}/setting`])
  }
}