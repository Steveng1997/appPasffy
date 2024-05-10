import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';

// Service
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { ServiceLiquidationTherapist } from 'src/app/core/services/liquidation/service-liquidation-therapist.service';
import { ServiceService } from 'src/app/core/services/service/service.service';

@Component({
  selector: 'app-new-liquid-therap',
  templateUrl: './new-liquid-therap.page.html',
  styleUrls: ['./new-liquid-therap.page.scss'],
})

export class NewLiquidTherapPage implements OnInit {

  dates: boolean = false
  selected: boolean = false
  administratorRole: boolean = false

  terapeuta: any
  unliquidatedService: any
  manager: any

  id: number
  liquidated: any

  // Comission
  totalCommission: number
  

  modelLiquidation: LiquidationTherapist = {
    createdDate: "",
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    formaPago: "",
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    id: 0,
    idUnico: "",
    idTerapeuta: "",
    importe: 0,
    regularizacion: "",
    terapeuta: "",
    tratamiento: 0,
    valueRegularizacion: 0
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private service: ServiceService,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService,
    private serviceLiquidation: ServiceLiquidationTherapist
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])

    this.getTherapist()

    if (this.id) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getById(this.id).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.getManager()
      } else {
        this.manager = rp
        this.administratorRole = false
        this.modelLiquidation.encargada = this.manager[0].nombre
        this.serviceLiquidation.consultManager(this.modelLiquidation.encargada).subscribe(async (rp) => {
          this.liquidated = rp
        })
      }
    })
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  async getThoseThatNotLiquidated() {
    this.service.getByLiquidTerapFalse().subscribe(async (datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = '', convertMonth = '', convertDay = '',
      untilMonth = 0, untilDay = 0, untilYear = 0, currentDate = new Date()

    await this.serviceLiquidation.consultTherapistAndManager(this.modelLiquidation.terapeuta, this.modelLiquidation.encargada).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        fromDay = rp[0]['hastaFechaLiquidado'].substring(0, 2)
        fromMonth = rp[0]['hastaFechaLiquidado'].substring(3, 5)
        fromYear = rp[0]['hastaFechaLiquidado'].substring(6, 8)

        this.modelLiquidation.desdeFechaLiquidado = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.modelLiquidation.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
        await this.inputDateAndTime()
      } else {
        await this.dateDoesNotExist()
      }
    })

    untilDay = currentDate.getDate()
    untilMonth = currentDate.getMonth() + 1
    untilYear = currentDate.getFullYear()

    if (untilMonth > 0 && untilMonth < 10) {
      convertMonth = '0' + untilMonth
      this.modelLiquidation.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    } else {
      convertMonth = untilMonth.toString()
      this.modelLiquidation.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }

    if (untilDay > 0 && untilDay < 10) {
      convertDay = '0' + untilDay
      this.modelLiquidation.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${convertDay}`
    } else {
      this.modelLiquidation.hastaFechaLiquidado = `${untilYear}-${convertMonth}-${untilDay}`
    }
  }

  async dateDoesNotExist() {
    let año = "", mes = "", dia = ""

    await this.service.getTerapeutaFechaAsc(this.modelLiquidation.terapeuta, this.modelLiquidation.encargada).subscribe(async (rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.modelLiquidation.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.modelLiquidation.desdeHoraLiquidado = rp[0]['horaStart']
      await this.inputDateAndTime()
    })
  }

  calculateServices() {
    if (this.modelLiquidation.encargada != "" && this.modelLiquidation.terapeuta != "") {
      this.getThoseThatNotLiquidated()
      this.ionLoaderService.simpleLoader()

      this.service.getByTerapeutaAndEncargada(this.modelLiquidation.terapeuta, this.modelLiquidation.encargada).subscribe(async (resp: any) => {
        if (resp.length > 0) {
          this.dates = false
          this.ionLoaderService.dismissLoader()
          await this.dateExists()
        } else {
          this.dates = false
          this.ionLoaderService.dismissLoader()
        }
      })
    } else {
      this.dates = false
    }
  }

  async inputDateAndTime() {
    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTerap = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0
    this.totalCommission = 0

    this.service.getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(this.modelLiquidation.terapeuta,
      this.modelLiquidation.encargada, this.modelLiquidation.desdeHoraLiquidado, this.modelLiquidation.hastaHoraLiquidado,
      this.modelLiquidation.desdeFechaLiquidado, this.modelLiquidation.hastaFechaLiquidado).subscribe(async (rp: any) => {

        if (rp.length > 0) {
          this.unliquidatedService = rp

          this.dates = true
          this.selected = true
          document.getElementById('overview').style.height = '4065px'
          document.getElementById('overviewDates').style.height = '392px'
        }

      })
  }

  regularization(event: any) {
    let numberRegularization = 0, valueRegularization = 0
    numberRegularization = Number(event.target.value)

    if (numberRegularization > 0) {
      valueRegularization = this.totalCommission + numberRegularization
    } else {
      valueRegularization = this.totalCommission + numberRegularization
    }

    this.modelLiquidation.valueRegularizacion = numberRegularization;

    if (valueRegularization > 999 || numberRegularization > 999) {

      const coma = valueRegularization.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalCommission.toString().split(".") : valueRegularization.toString().split("");
      let integer = coma ? array[0].split("") : array;
      let subIndex = 1;

      for (let i = integer.length - 1; i >= 0; i--) {

        if (integer[i] !== "." && subIndex % 3 === 0 && i != 0) {

          integer.splice(i, 0, ".");
          subIndex++;

        } else {
          subIndex++;
        }
      }

      integer = [integer.toString().replace(/,/gi, "")]
      this.totalCommission = Number(integer[0])
    } else {
      this.totalCommission = valueRegularization
      // this.valueRegular = numberRegularization.toString()
    }
  }


  back() {
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
  }
}