import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';

// Services
import { ServiceLiquidationTherapist } from 'src/app/core/services/liquidation/service-liquidation-therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.page.html',
  styleUrls: ['./therapist.page.scss'],
})

export class TherapistPage implements OnInit {

  page!: number

  details: boolean = false
  filter: boolean = false
  today: boolean = true
  administratorRole: boolean = false

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

  id: number
  liquidated: any

  CurrenDate = ""
  dateTodayCurrent: string
  dateStart: string
  dateEnd: string
  fechaInicio: string
  fechaFinal: string
  horaInicio: string
  horaFinal: string
  day: number
  month: string
  hourStart: string
  hourEnd: string
  parmHourStart: string
  parmHourEnd: string
  selectedDateStart: string
  selectedDateEnd: string

  liquidationTherapist: LiquidationTherapist = {
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
    private serviceLiquidation: ServiceLiquidationTherapist,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])
    // this.ionLoaderService.simpleLoader()
    this.todaysDdate()

    this.date()
    this.getLiquidation()
    this.getTerapeuta()

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
        this.liquidationTherapist.encargada = this.manager[0].nombre
        this.serviceLiquidation.consultManager(this.liquidationTherapist.encargada).subscribe(async (rp) => {
          this.liquidated = rp
          this.ionLoaderService.dismissLoader()
        })
      }
    })
  }

  async getLiquidation() {
    this.dateTodayCurrent = 'HOY'

    this.serviceLiquidation.consultTherapistSettlements().subscribe(async (rp: any) => {
      this.liquidated = rp
      this.ionLoaderService.dismissLoader()
    })
  }

  getTerapeuta() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  date() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.CurrenDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.CurrenDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.CurrenDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.CurrenDate = `${year}-${convertMonth}-${day}`
    }
  }

  filters = async () => {
    this.serviceLiquidation.consultTherapistSettlements().subscribe(async (rp: any) => {
      this.liquidated = rp
      await this.calculateSumOfServices()
    })
  }

  calculateSumOfServices = async () => {

    const therapistCondition = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const managerCondition = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const conditionBetweenDates = serv => {
      if (this.dateStart === undefined && this.dateEnd === undefined) return true
      if (this.dateStart === undefined && serv.fechaHoyInicio <= this.dateEnd) return true
      if (this.dateEnd === undefined && serv.fechaHoyInicio === this.dateStart) return true
      if (serv.fechaHoyInicio >= this.dateStart && serv.fechaHoyInicio <= this.dateEnd) return true

      return false
    }

    this.parmHourStart = `${this.dateStart} ${this.horaInicio}`
    this.parmHourEnd = `${this.dateEnd} ${this.horaFinal}`

    const conditionBetweenHours = serv => {
      if (this.horaInicio === undefined && this.hourStart === undefined) return true
      if (this.horaInicio === undefined && serv.horaFinal <= this.horaFinal) return true
      if (this.horaFinal === undefined && serv.horaInicio === this.horaInicio) return true
      if (`${serv.fechaHoyInicio} ${serv.hourStart}` >= this.parmHourStart && `${serv.fechaHoyInicio} ${serv.hourEnd}` <= this.parmHourEnd) return true

      return false
    }

    // Filter by Servicio
    // if (Array.isArray(this.liquidated)) {

    //   const servicios = this.liquidated.filter(serv => therapistCondition(serv)
    //     && managerCondition(serv) && conditionBetweenDates(serv)
    //     && conditionBetweenHours(serv))
    //   this.totalServicio = servicios.reduce((accumulator, serv) => {
    //     return accumulator + serv.servicio
    //   }, 0)

    //   // Filter by Valor Total
    //   const valorTotal = this.servicio.filter(serv => therapistCondition(serv)
    //     && managerCondition(serv) && conditionBetweenDates(serv)
    //     && conditionBetweenHours(serv))
    //   this.totalValor = valorTotal.reduce((accumulator, serv) => {
    //     this.idService = valorTotal
    //     this.liquidated = valorTotal
    //     return accumulator + serv.totalServicio
    //   }, 0)
    // }

    // this.thousandPoint()
  }

  detail(liquidated: any) {

  }

  emptyFilter() {
    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.fechaInicio = ""
    this.fechaFinal = ""
  }

  btnFilter() {
    this.filter = true
    // this.validateCheck()
  }

  close() {
    this.filter = false
  }

  todaysDdate() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = '', currentDate

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      currentDate = `${year}-${convertMonth}-${day}`
      this.day = day
    } else {
      convertMonth = month.toString()
      currentDate = `${year}-${convertMonth}-${day}`
      this.day = day
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      currentDate = `${year}-${convertMonth}-${convertDay}`
      this.day = day
    } else {
      currentDate = `${year}-${convertMonth}-${day}`
      this.day = day
    }

    if (convertMonth == '12') this.month = 'Diciembre'

    if (convertMonth == '11') this.month = 'Noviembre'

    if (convertMonth == '10') this.month = 'Octubre'

    if (convertMonth == '09') this.month = 'Septiembre'

    if (convertMonth == '08') this.month = 'Agosto'

    if (convertMonth == '07') this.month = 'Julio'

    if (convertMonth == '06') this.month = 'Junio'

    if (convertMonth == '05') this.month = 'Mayo'

    if (convertMonth == '04') this.month = 'Abril'

    if (convertMonth == '03') this.month = 'Marzo'

    if (convertMonth == '02') this.month = 'Febrero'

    if (convertMonth == '01') this.month = 'Enero'

    this.dateStart = currentDate
    this.dateEnd = currentDate
  }

  goManager() {
    this.router.navigate([`tabs/${this.id}/liquidation-manager`])
  }
}