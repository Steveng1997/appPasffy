import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Models
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';
import { ModelService } from 'src/app/core/models/service';

// Services
import { ServiceLiquidationTherapist } from 'src/app/core/services/liquidation/service-liquidation-therapist.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { ServiceService } from 'src/app/core/services/service/service.service';
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
  buttonEmpty: boolean = false

  terapeuta: any
  selectedTerapeuta: string

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

  // Conteo fecha
  count: number = 0
  atrasCount: number = 0
  siguienteCount: number = 0
  fechaFormat = new Date()

  // ------------------------------------------------------
  // Details
  idDetail: number
  idTherapist: string
  nameTherapist: string
  sinceDate: string
  sinceTime: string
  toDate: string
  untilTime: string
  payment: string

  settledData: any
  terapeutaName: any

  totalLiquidation: string
  company: string

  // Sum
  totalService: string
  totalTipValue: string
  totalTherapistValue: string
  totalValueDrink: string
  totalValueDrinkTherap: string
  totalTobaccoValue: string
  totalValueVitamins: string
  totalValueOther: string

  // Total
  totalTreatment: string
  totalTip: string
  totalDrink: string
  totalDrinkTherap: string
  totalTobacco: string
  totalVitamin: string
  totalOther: string

  totalCash: string
  totalBizum: string
  totalCard: string
  totalTransaction: string

  sumCommission: string

  // Total de todo
  totalSum: string
  sumTherapist: string
  totalReceived: string

  totalImport: string

  // --------------------------------

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
    terapeuta: "",
    tratamiento: 0,
  }

  modelServices: ModelService = {
    idTerapeuta: "",
    pantalla: ""
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceLiquidation: ServiceLiquidationTherapist,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService,
    private services: ServiceService
  ) { }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])
    this.selectedEncargada = ""
    this.selectedTerapeuta = ""
    this.selectedFormPago = ""
    this.todaysDdate()

    this.date()
    await this.getLiquidation()
    this.getTerapeuta()

    if (this.id) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getById(this.id).subscribe((rp) => {
      this.company = rp[0].company
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.getManager()
      } else {
        this.manager = rp
        this.administratorRole = false
        this.liquidationTherapist.encargada = this.manager[0].nombre
        this.serviceLiquidation.consultManager(this.liquidationTherapist.encargada, rp[0].company).subscribe(async (rp: any) => {
          this.liquidated = rp
        })
      }
    })
  }

  async consultLiquidationTherapistByManager() {
    this.serviceLiquidation.consultManager(this.liquidationTherapist.encargada, this.company).subscribe(async (rp) => {
      this.liquidated = rp
      this.total(rp)
      this.liquidationTherapist.encargada = ""
      this.liquidationTherapist.terapeuta = ""
    })
  }

  getLiquidation = async () => {
    this.dateTodayCurrent = 'HOY'

    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.company = rp[0].company
      this.serviceLiquidation.consultTherapistSettlements(rp[0].company).subscribe(async (rp: any) => {
        this.liquidated = rp
      })
    })
  }

  getTerapeuta() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.serviceTherapist.getByCompany(rp[0].company).subscribe((datosTerapeuta: any) => {
        this.terapeuta = datosTerapeuta
      })
    })
  }

  getManager() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.serviceManager.getByCompany(rp[0].company).subscribe((datosEncargada: any) => {
        this.manager = datosEncargada
      })
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
    this.serviceLiquidation.consultTherapistSettlements(this.company).subscribe((rp: any) => {
      this.liquidated = rp
      this.calculateSumOfServices()
    })
  }

  calculateSumOfServices() {
    const therapistCondition = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const managerCondition = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const conditionBetweenDates = serv => {
      if (this.dateStart === undefined && this.dateEnd === undefined) return true
      if (this.dateStart === undefined && serv.createdDate <= this.dateEnd) return true
      if (this.dateEnd === undefined && serv.createdDate === this.dateStart) return true
      if (serv.createdDate >= this.dateStart && serv.createdDate <= this.dateEnd) return true

      return false
    }

    this.parmHourStart = `${this.dateStart} ${this.hourStart}`
    this.parmHourEnd = `${this.dateEnd} ${this.hourEnd}`

    let monthStart, dayStart, monthEnd, dayEnd

    dayStart = this.dateStart.substring(8, 10)
    monthStart = this.dateStart.substring(5, 7)

    dayEnd = this.dateEnd.substring(8, 10)
    monthEnd = this.dateEnd.substring(5, 7)

    this.dateTodayCurrent = `${dayStart}-${monthStart} ${dayEnd}-${monthEnd}`
    if (this.dateTodayCurrent != '') this.today = true

    const conditionBetweenHours = serv => {
      if (this.hourStart === undefined && this.hourStart === undefined) return true
      if (this.hourStart === undefined && serv.hourEnd <= this.hourEnd) return true
      if (this.hourEnd === undefined && serv.hourStart === this.hourStart) return true
      if (`${serv.createdDate} ${serv.hourStart}` >= this.parmHourStart && `${serv.createdDate} ${serv.hourEnd}` <= this.parmHourEnd) return true

      return false
    }

    if (Array.isArray(this.liquidated)) {
      const servicios = this.liquidated.filter(serv => therapistCondition(serv) && managerCondition(serv) && conditionBetweenDates(serv) && conditionBetweenHours(serv))
      this.total(servicios)
    }
  }

  emptyFilter() {
    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.dateStart = this.CurrenDate
    this.dateEnd = this.CurrenDate
    this.buttonEmpty = true
  }

  btnFilter() {
    if (this.filter == true) {
      this.filter = false

      if (this.dateStart == this.dateEnd) {
        this.today = true
        this.dateTodayCurrent = 'HOY'
      }

      if (this.buttonEmpty == true)
        this.calculatedTotal()

    } else {
      this.buttonEmpty = false
      this.filter = true
    }
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

    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      if (rp[0]['rol'] == 'administrador') {
        this.serviceLiquidation.getDateCurrentDay(currentDate, rp[0]['company']).subscribe((rp: any) => {
          this.liquidated = rp
          this.total(rp)
        })
      } else {
        this.serviceLiquidation.getEncargadaAndDate(currentDate, rp[0]['nombre']).subscribe((rp: any) => {
          this.liquidated = rp
          this.total(rp)
        })
      }
    })
  }

  goManager() {
    this.router.navigate([`tabs/${this.id}/liquidation-manager`])
  }

  goService(id: number) {
    this.services.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) {
        this.modelServices.pantalla = 'liquidation-therapist'
        this.services.updateScreenById(rp[0]['id'], this.modelServices).subscribe(async (rp: any) => { })
        this.router.navigate([`tabs/${this.id}/edit-services/${rp[0]['id']}`])
      }
    })
  }

  notes() {

  }

  new() {
    this.router.navigate([`tabs/${this.id}/new-liquiationTherapist`])
  }

  total(rp) {
    const imports = rp.map(({ importe }) => importe).reduce((acc, value) => acc + value, 0)

    if (imports > 999)
      this.totalImport = (imports / 1000).toFixed(3)
    else
      this.totalImport = imports.toString()
  }

  backArrow = async () => {
    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0,
      añoHoy = 0, convertMesHoy = ''

    this.details = false
    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    } else {
      convertMesHoy = mesHoy.toString()
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (this.siguienteCount > 0) {
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', fechaHoy = '', mes = '', month = '',
        fechaActualmente = '', convertionAño

      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') {
          mes = "12"
          month = 'Diciembre'
        }

        if (convertmes == 'Nov') {
          mes = "11"
          month = 'Noviembre'
        }

        if (convertmes == 'Oct') {
          mes = "10"
          month = 'Octubre'
        }

        if (convertmes == 'Sep') {
          mes = "09"
          month = 'Septiembre'
        }

        if (convertmes == 'Aug') {
          mes = "08"
          month = 'Agosto'
        }

        if (convertmes == 'Jul') {
          mes = "07"
          month = 'Julio'
        }

        if (convertmes == 'Jun') {
          mes = "06"
          month = 'Junio'
        }

        if (convertmes == 'May') {
          mes = "05"
          month = 'Mayo'
        }

        if (convertmes == 'Apr') {
          mes = "04"
          month = 'Abril'
        }

        if (convertmes == 'Mar') {
          mes = "03"
          month = 'Marzo'
        }

        if (convertmes == 'Feb') {
          mes = "02"
          month = 'Febrero'
        }

        if (convertmes == 'Jan') {
          mes = "01"
          month = 'Enero'
        }

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.today = true
          this.dateTodayCurrent = 'HOY'
        } else {
          this.today = false
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`
        this.dateStart = fechaActualmente
        this.dateEnd = fechaActualmente

        this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          } else {
            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          }
        })

        this.atrasCount = this.count

        return true
      }
    } else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', month = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = '', convertionAño

      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() - this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') {
          mes = "12"
          month = 'Diciembre'
        }

        if (convertmes == 'Nov') {
          mes = "11"
          month = 'Noviembre'
        }

        if (convertmes == 'Oct') {
          mes = "10"
          month = 'Octubre'
        }

        if (convertmes == 'Sep') {
          mes = "09"
          month = 'Septiembre'
        }

        if (convertmes == 'Aug') {
          mes = "08"
          month = 'Agosto'
        }

        if (convertmes == 'Jul') {
          mes = "07"
          month = 'Julio'
        }

        if (convertmes == 'Jun') {
          mes = "06"
          month = 'Junio'
        }

        if (convertmes == 'May') {
          mes = "05"
          month = 'Mayo'
        }

        if (convertmes == 'Apr') {
          mes = "04"
          month = 'Abril'
        }

        if (convertmes == 'Mar') {
          mes = "03"
          month = 'Marzo'
        }

        if (convertmes == 'Feb') {
          mes = "02"
          month = 'Febrero'
        }

        if (convertmes == 'Jan') {
          mes = "01"
          month = 'Enero'
        }

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.today = true
          this.dateTodayCurrent = 'HOY'
        } else {
          this.today = false
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`
        this.dateStart = fechaActualmente
        this.dateEnd = fechaActualmente

        this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          } else {
            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          }
        })

        this.atrasCount = this.count

        return true
      }
    }
    return false
  }

  nextArrow = async () => {
    let fechaDia = new Date(), mesDelDia = 0, convertMess = '', messs = '', convertimosMes = 0
    mesDelDia = fechaDia.getMonth() + 1

    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0, añoHoy = 0, convertMesHoy = ''

    this.details = false
    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()

    if (mesHoy > 0 && mesHoy < 10) {
      convertMesHoy = '0' + mesHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    } else {
      convertMesHoy = mesHoy.toString()
      fechaEnd = `${añoHoy}-${mesHoy}-${diaHoy}`
    }

    if (diaHoy > 0 && diaHoy < 10) {
      convertDiaHoy = '0' + diaHoy
      fechaEnd = `${añoHoy}-${convertMesHoy}-${convertDiaHoy}`
    } else {
      fechaEnd = `${añoHoy}-${convertMesHoy}-${diaHoy}`
    }

    if (this.atrasCount > 0) {
      this.atrasCount = 0
      this.count = 0
      this.count++
      convertMess = this.fechaFormat.toString().substring(4, 7)
      if (convertMess == 'Dec') messs = "12"
      if (convertMess == 'Nov') messs = "11"
      if (convertMess == 'Oct') messs = "10"
      if (convertMess == 'Sep') messs = "09"
      if (convertMess == 'Aug') messs = "08"
      if (convertMess == 'Jul') messs = "07"
      if (convertMess == 'Jun') messs = "06"
      if (convertMess == 'May') messs = "05"
      if (convertMess == 'Apr') messs = "04"
      if (convertMess == 'Mar') messs = "03"
      if (convertMess == 'Feb') messs = "02"
      if (convertMess == 'Jan') messs = "01"

      convertimosMes = Number(messs)
      this.atrasCount = 0
      this.count = 0
      this.count++

      let convertmes = '', convertDia = '', convertAño = '', mes = '', month = '', fechaHoy = '',
        fechaActualmente = '', convertionAño = ''

      for (let i = 0; i < this.count; i++) {
        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') {
          mes = "12"
          month = 'Diciembre'
        }

        if (convertmes == 'Nov') {
          mes = "11"
          month = 'Noviembre'
        }

        if (convertmes == 'Oct') {
          mes = "10"
          month = 'Octubre'
        }

        if (convertmes == 'Sep') {
          mes = "09"
          month = 'Septiembre'
        }

        if (convertmes == 'Aug') {
          mes = "08"
          month = 'Agosto'
        }

        if (convertmes == 'Jul') {
          mes = "07"
          month = 'Julio'
        }

        if (convertmes == 'Jun') {
          mes = "06"
          month = 'Junio'
        }

        if (convertmes == 'May') {
          mes = "05"
          month = 'Mayo'
        }

        if (convertmes == 'Apr') {
          mes = "04"
          month = 'Abril'
        }

        if (convertmes == 'Mar') {
          mes = "03"
          month = 'Marzo'
        }

        if (convertmes == 'Feb') {
          mes = "02"
          month = 'Febrero'
        }

        if (convertmes == 'Jan') {
          mes = "01"
          month = 'Enero'
        }

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.today = true
          this.dateTodayCurrent = 'HOY'
        } else {
          this.today = false
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`
        this.dateStart = fechaActualmente
        this.dateEnd = fechaActualmente

        this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          } else {

            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          }
        })

        this.atrasCount = 0
        this.count = 0
        return true
      }
    }

    else {
      this.atrasCount = 0
      this.siguienteCount = 0
      this.count = 0
      this.count++
      let convertmes = '', convertDia = '', convertAño = '', mes = '', month = '', fechaHoy = '',
        convertFecha = '', fechaActualmente = '', convertionAño

      for (let i = 0; i < this.count; i++) {

        this.fechaFormat.setDate(this.fechaFormat.getDate() + this.count)
        convertFecha = this.fechaFormat.toString()
        this.fechaFormat = new Date(convertFecha)

        convertDia = this.fechaFormat.toString().substring(8, 10)
        convertmes = this.fechaFormat.toString().substring(4, 7)
        convertAño = this.fechaFormat.toString().substring(11, 15)
        convertionAño = this.fechaFormat.toString().substring(13, 15)

        if (convertmes == 'Dec') {
          mes = "12"
          month = 'Diciembre'
        }

        if (convertmes == 'Nov') {
          mes = "11"
          month = 'Noviembre'
        }

        if (convertmes == 'Oct') {
          mes = "10"
          month = 'Octubre'
        }

        if (convertmes == 'Sep') {
          mes = "09"
          month = 'Septiembre'
        }

        if (convertmes == 'Aug') {
          mes = "08"
          month = 'Agosto'
        }

        if (convertmes == 'Jul') {
          mes = "07"
          month = 'Julio'
        }

        if (convertmes == 'Jun') {
          mes = "06"
          month = 'Junio'
        }

        if (convertmes == 'May') {
          mes = "05"
          month = 'Mayo'
        }

        if (convertmes == 'Apr') {
          mes = "04"
          month = 'Abril'
        }

        if (convertmes == 'Mar') {
          mes = "03"
          month = 'Marzo'
        }

        if (convertmes == 'Feb') {
          mes = "02"
          month = 'Febrero'
        }

        if (convertmes == 'Jan') {
          mes = "01"
          month = 'Enero'
        }

        fechaHoy = `${convertAño}-${mes}-${convertDia}`

        if (fechaEnd == fechaHoy) {
          this.today = true
          this.dateTodayCurrent = 'HOY'
        } else {
          this.today = false
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`
        this.dateStart = fechaActualmente
        this.dateEnd = fechaActualmente

        this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          } else {

            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
              this.total(rp)
            })
          }
        })

        this.siguienteCount = this.count
        return true
      }
    }
    return false
  }

  // details

  detail(id: string) {
    if (this.details == true) {
      this.details = false
    } else {

      this.serviceLiquidation.consultTherapistId(id).subscribe(async (rp) => {
        this.nameTherapist = rp[0].terapeuta
        this.sinceDate = rp[0].desdeFechaLiquidado
        this.sinceTime = rp[0].desdeHoraLiquidado
        this.toDate = rp[0].hastaFechaLiquidado
        this.untilTime = rp[0].hastaHoraLiquidado
        this.payment = rp[0].formaPago
        this.idDetail = rp[0].id
        this.idTherapist = rp[0].idTerapeuta

        await this.sumTotal(id)
      })
    }
  }

  async sumTotal(id: string) {
    this.services.getByIdTerap(id).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.settledData = rp

        // Filter by servicio
        const servicios = rp.filter(serv => serv)
        let service = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.servicio
        }, 0)

        // Filter by Propina
        const propinas = rp.filter(serv => serv)
        let tip = propinas.reduce((accumulator, serv) => {
          return accumulator + serv.propina
        }, 0)

        // Filter by Bebida
        const bebida = rp.filter(serv => serv)
        let drink = bebida.reduce((accumulator, serv) => {
          return accumulator + serv.bebidas
        }, 0)

        // Filter by Bebida
        const drinkTherap = rp.filter(serv => serv)
        let drinkTherapist = drinkTherap.reduce((accumulator, serv) => {
          return accumulator + serv.bebidaTerap
        }, 0)

        // Filter by Tabaco
        const tabac = rp.filter(serv => serv)
        let tobacco = tabac.reduce((accumulator, serv) => {
          return accumulator + serv.tabaco
        }, 0)

        // Filter by Vitamina
        const vitamina = rp.filter(serv => serv)
        let vitamins = vitamina.reduce((accumulator, serv) => {
          return accumulator + serv.vitaminas
        }, 0)

        // Filter by Vitamina
        const otroServicio = rp.filter(serv => serv)
        let others = otroServicio.reduce((accumulator, serv) => {
          return accumulator + serv.otros
        }, 0)

        // Filter by totalCash
        const totalCashs = rp.filter(serv => serv)
        let totalCash = totalCashs.reduce((accumulator, serv) => {
          return accumulator + serv.valueEfectTerapeuta
        }, 0)

        // Filter by totalBizum
        const totalBizums = rp.filter(serv => serv)
        let totalBizum = totalBizums.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizuTerapeuta
        }, 0)

        // Filter by totalCard
        const totalCards = rp.filter(serv => serv)
        let totalCard = totalCards.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeTerapeuta
        }, 0)

        // Filter by totalTransaction
        const totalTransactions = rp.filter(serv => serv)
        let totalTransaction = totalTransactions.reduce((accumulator, serv) => {
          return accumulator + serv.valueTransTerapeuta
        }, 0)

        this.comission(service, tip, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)
      } else {
        await this.serviceLiquidation.consultTherapistId(id).subscribe(async (rp: any) => {
        })
      }
    })
  }

  async comission(service: number, tip: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element,
    totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number) {

    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0, totalCommission = 0,
      sumCommission = 0, receivedTherapist = 0

    this.serviceTherapist.getTerapeuta(element[0]['terapeuta']).subscribe(async (rp: any) => {
      this.terapeutaName = rp[0]

      // Comision
      comisiServicio = service / 100 * rp[0]?.servicio
      comiPropina = tip / 100 * rp[0]?.propina
      comiBebida = drink / 100 * rp[0]?.bebida
      comiBebidaTherapist = drinkTherapist / 100 * rp[0]?.bebidaTerap
      comiTabaco = tobacco / 100 * rp[0]?.tabaco
      comiVitamina = vitamins / 100 * rp[0]?.vitamina
      comiOtros = others / 100 * rp[0]?.otros

      // Conversion decimal
      let totalTreatment = Number(comisiServicio.toFixed(1))
      let totalTip = Number(comiPropina.toFixed(1))
      let totalDrink = Number(comiBebida.toFixed(1))
      let totalDrinkTherap = Number(comiBebidaTherapist.toFixed(1))
      let totalTobacco = Number(comiTabaco.toFixed(1))
      let totalVitamin = Number(comiVitamina.toFixed(1))
      let totalOther = Number(comiOtros.toFixed(1))

      sumComision = Number(totalTreatment) + Number(totalTip) + Number(totalDrink) + Number(totalDrinkTherap) + Number(totalTobacco) + Number(totalVitamin) + Number(totalOther)

      if (sumComision != 0 || sumComision != undefined) {
        sumCommission = Number(sumComision.toFixed(1))
      }

      element.map(item => {
        const numbTerap = this.settledData.filter(serv => serv)
        receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)
      })

      let totalLiquidation = sumCommission - Number(receivedTherapist)
      totalCommission = sumCommission - Number(receivedTherapist)

      let sumTherapist = totalCash + totalBizum + totalCard + totalTransaction

      await this.thousandPointEdit(totalLiquidation, service, totalTreatment, tip, totalTip, drink, drinkTherapist, totalDrink, totalDrinkTherap, tobacco,
        totalTobacco, vitamins, totalVitamin, others, totalOther, sumCommission, receivedTherapist, totalCash, totalBizum, totalCard, totalTransaction, sumTherapist)

      this.details = true

      if (rp.length == 0) this.totalLiquidation = '0'
    })
  }

  async thousandPointEdit(totalLiquidation: number, service: number, totalTreatment: number, tip: number, totalTip: number, drink: number, drinkTherap: number, totalDrink: number,
    totalDrinkTherap: number, tobacco: number, totalTobacco: number, vitamins: number, totalVitamin: number, others: number, totalOther: number, sumCommission: number,
    receivedTherapist: number, totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number, sumTherapist: number) {

    if (totalLiquidation > 999)
      this.totalLiquidation = (totalLiquidation / 1000).toFixed(3)
    else
      this.totalLiquidation = totalLiquidation.toString()

    if (service > 999)
      this.totalService = (service / 1000).toFixed(3)
    else
      this.totalService = service.toString()

    if (totalTreatment > 999)
      this.totalTreatment = (totalTreatment / 1000).toFixed(3)
    else
      this.totalTreatment = totalTreatment.toString()

    if (tip > 999)
      this.totalTipValue = (tip / 1000).toFixed(3)
    else
      this.totalTipValue = tip.toString()

    if (totalTip > 999)
      this.totalTip = (totalTip / 1000).toFixed(3)
    else
      this.totalTip = totalTip.toString()

    if (drink > 999)
      this.totalValueDrink = (drink / 1000).toFixed(3)
    else
      this.totalValueDrink = drink.toString()

    if (drinkTherap > 999)
      this.totalValueDrinkTherap = (drinkTherap / 1000).toFixed(3)
    else
      this.totalValueDrinkTherap = drinkTherap.toString()

    if (totalDrink > 999)
      this.totalDrink = (totalDrink / 1000).toFixed(3)
    else
      this.totalDrink = totalDrink.toString()

    if (totalDrinkTherap > 999)
      this.totalDrinkTherap = (totalDrinkTherap / 1000).toFixed(3)
    else
      this.totalDrinkTherap = totalDrinkTherap.toString()

    if (tobacco > 999)
      this.totalTobaccoValue = (tobacco / 1000).toFixed(3)
    else
      this.totalTobaccoValue = tobacco.toString()

    if (totalTobacco > 999)
      this.totalTobacco = (totalTobacco / 1000).toFixed(3)
    else
      this.totalTobacco = totalTobacco.toString()

    if (vitamins > 999)
      this.totalValueVitamins = (vitamins / 1000).toFixed(3)
    else
      this.totalValueVitamins = vitamins.toString()

    if (totalVitamin > 999)
      this.totalVitamin = (totalVitamin / 1000).toFixed(3)
    else
      this.totalVitamin = totalVitamin.toString()

    if (others > 999)
      this.totalValueOther = (others / 1000).toFixed(3)
    else
      this.totalValueOther = others.toString()

    if (totalOther > 999)
      this.totalOther = (totalOther / 1000).toFixed(3)
    else
      this.totalOther = totalOther.toString()

    if (sumCommission > 999)
      this.totalSum = (sumCommission / 1000).toFixed(3)
    else
      this.totalSum = sumCommission.toString()

    if (receivedTherapist > 999)
      this.totalReceived = (receivedTherapist / 1000).toFixed(3)
    else
      this.totalReceived = receivedTherapist.toString()

    for (let o = 0; o < this.settledData?.length; o++) {

      if (this.settledData[o]?.servicio > 999)
        this.settledData[o]['servicio'] = (this.settledData[o]?.servicio / 1000).toFixed(3)
      else
        this.settledData[o]['servicio'] = this.settledData[o]?.servicio.toString()

      if (this.settledData[o]?.propina > 999)
        this.settledData[o]['propina'] = (this.settledData[o]?.propina / 1000).toFixed(3)
      else
        this.settledData[o]['propina'] = this.settledData[o]?.propina.toString()

      if (this.settledData[o]?.numberTerap > 999)
        this.settledData[o]['numberTerap'] = (this.settledData[o]?.numberTerap / 1000).toFixed(3)
      else
        this.settledData[o]['numberTerap'] = this.settledData[o]?.numberTerap.toString()

      if (this.settledData[o]?.bebidas > 999)
        this.settledData[o]['bebidas'] = (this.settledData[o]?.bebidas / 1000).toFixed(3)
      else
        this.settledData[o]['bebidas'] = this.settledData[o]?.bebidas.toString()

      if (this.settledData[o]?.tabaco > 999)
        this.settledData[o]['tabaco'] = (this.settledData[o]?.tabaco / 1000).toFixed(3)
      else
        this.settledData[o]['tabaco'] = this.settledData[o]?.tabaco.toString()

      if (this.settledData[o]?.vitaminas > 999)
        this.settledData[o]['vitaminas'] = (this.settledData[o]?.vitaminas / 1000).toFixed(3)
      else
        this.settledData[o]['vitaminas'] = this.settledData[o]?.vitaminas.toString()

      if (this.settledData[o]?.otros > 999)
        this.settledData[o]['otros'] = (this.settledData[o]?.otros / 1000).toFixed(3)
      else
        this.settledData[o]['otros'] = this.settledData[o]?.otros.toString()
    }

    if (totalCash > 999)
      this.totalCash = (totalCash / 1000).toFixed(3)
    else
      this.totalCash = totalCash.toString()

    if (totalBizum > 999)
      this.totalBizum = (totalBizum / 1000).toFixed(3)
    else
      this.totalBizum = totalBizum.toString()

    if (totalCard > 999)
      this.totalCard = (totalCard / 1000).toFixed(3)
    else
      this.totalCard = totalCard.toString()

    if (totalTransaction > 999)
      this.totalTransaction = (totalTransaction / 1000).toFixed(3)
    else
      this.totalTransaction = totalTransaction.toString()

    if (sumTherapist > 999)
      this.sumTherapist = (sumTherapist / 1000).toFixed(3)
    else
      this.sumTherapist = sumTherapist.toString()
  }

  calculatedTotal() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      if (rp[0]['rol'] == 'administrador') {
        this.serviceLiquidation.getDateCurrentDay(this.dateStart, this.company).subscribe((rp: any) => {
          this.liquidated = rp
          this.total(rp)
        })
      } else {
        this.serviceLiquidation.getEncargadaAndDate(this.dateStart, this.nameTherapist).subscribe((rp: any) => {
          this.liquidated = rp
          this.total(rp)
        })
      }
    })
  }

  delete() {
    Swal.fire({
      heightAuto: false,
      title: '¿Deseas eliminar el registro?',
      text: "Una vez eliminados ya no se podrán recuperar",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Deseo eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.modelServices.idTerapeuta = ""
        this.modelServices.liquidadoTerapeuta = false
        this.services.updateTherapistSettlementTherapistIdByTherapistId(this.idTherapist, this.modelServices).subscribe(async (rp) => {
          this.serviceLiquidation.deleteLiquidationTherapist(this.idDetail).subscribe(async (rp) => {
            if (this.administratorRole == true) {
              await this.getLiquidation()
            }
            else {
              await this.consultLiquidationTherapistByManager()
            }

            this.calculatedTotal()
            this.details = false
          })
        })
      }
    })
  }
}