import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Models
import { LiquidationManager } from 'src/app/core/models/liquidationManager';
import { ModelService } from 'src/app/core/models/service';

// Services
import { ServiceLiquidationManagerService } from 'src/app/core/services/liquidation/service-liquidation-manager.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { ServiceService } from 'src/app/core/services/service/service.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})

export class ManagerPage {

  page!: number

  details: boolean = false
  filter: boolean = false
  today: boolean = true
  administratorRole: boolean = false

  manager: any
  selectedEncargada: string

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
  idManager: string
  nameTherapist: string
  sinceDate: string
  sinceTime: string
  toDate: string
  untilTime: string
  regularization: number
  fixedDay: number
  numberDay: number
  totalFixedDay: string

  settledData: any
  terapeutaName: any

  totalLiquidation: string
  importe: number

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

  // --------------------------------

  liquidationManager: LiquidationManager = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    fixedDay: 0,
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    createdDate: "",
    id: 0,
    idUnico: "",
    idEncargada: "",
    importe: 0,
    tratamiento: 0,
  }

  modelServices: ModelService = {
    idEncargada: ""
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceLiquidation: ServiceLiquidationManagerService,
    private serviceManager: ManagerService,
    private services: ServiceService
  ) { }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])
    this.todaysDdate()

    this.date()
    await this.getLiquidation()

    if (this.id) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getById(this.id).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.GetAllManagers()
      } else {
        this.manager = rp
        this.administratorRole = false
        this.liquidationManager.encargada = this.manager[0].nombre
        this.serviceLiquidation.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp) => {
          this.liquidated = rp
        })
      }
    })
  }

  async consultLiquidationManager() {
    this.serviceLiquidation.getByEncargada(this.liquidationManager.encargada).subscribe(async (rp) => {
      this.liquidated = rp
      this.liquidationManager.encargada = ""
    })
  }

  getLiquidation = async () => {
    this.dateTodayCurrent = 'HOY'

    this.serviceLiquidation.getLiquidacionesEncargada().subscribe(async (rp: any) => {
      this.liquidated = rp
    })
  }

  GetAllManagers() {
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
    this.serviceLiquidation.getLiquidacionesEncargada().subscribe(async (rp: any) => {
      this.liquidated = rp
    })
  }

  emptyFilter() {
    this.selectedEncargada = ""
    this.fechaInicio = ""
    this.fechaFinal = ""
  }

  btnFilter() {
    if (this.filter == true) {
      this.filter = false
    } else {
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
  }

  goTherapist() {
    this.selectedEncargada = ""
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
  }

  notes() {

  }

  new() {
    this.router.navigate([`tabs/${this.id}/new-liquiationManager`])
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
            this.serviceLiquidation.getDateCurrentDay(fechaActualmente).subscribe((rp: any) => {
              this.liquidated = rp
            })
          } else {
            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
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

            this.serviceLiquidation.getDateCurrentDay(fechaActualmente).subscribe((rp: any) => {
              this.liquidated = rp
            })
          } else {
            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
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
            this.serviceLiquidation.getDateCurrentDay(fechaActualmente).subscribe((rp: any) => {
              this.liquidated = rp
            })
          } else {

            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
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

            this.serviceLiquidation.getDateCurrentDay(fechaActualmente).subscribe((rp: any) => {
              this.liquidated = rp
            })
          } else {

            this.serviceLiquidation.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              this.liquidated = rp
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

      this.serviceLiquidation.getIdEncarg(id).subscribe(async (rp) => {
        this.nameTherapist = rp[0].encargada
        this.sinceDate = rp[0].desdeFechaLiquidado
        this.sinceTime = rp[0].desdeHoraLiquidado
        this.toDate = rp[0].hastaFechaLiquidado
        this.untilTime = rp[0].hastaHoraLiquidado
        this.fixedDay = rp[0].fixedDay
        this.idDetail = rp[0].id
        this.idManager = rp[0].idEncargada
        this.importe = rp[0].importe

        await this.sumTotal(id)
      })
    }
  }

  async sumTotal(id: string) {
    this.services.getByIdEncarg(id).subscribe(async (rp: any) => {
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
          return accumulator + serv.valueEfectEncargada
        }, 0)

        // Filter by totalBizum
        const totalBizums = rp.filter(serv => serv)
        let totalBizum = totalBizums.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizuEncargada
        }, 0)

        // Filter by totalCard
        const totalCards = rp.filter(serv => serv)
        let totalCard = totalCards.reduce((accumulator, serv) => {
          return accumulator + serv.valueTarjeEncargada
        }, 0)

        // Filter by totalTransaction
        const totalTransactions = rp.filter(serv => serv)
        let totalTransaction = totalTransactions.reduce((accumulator, serv) => {
          return accumulator + serv.valueTransEncargada
        }, 0)

        this.comission(service, tip, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)
      } else {
        await this.serviceLiquidation.getIdEncarg(id).subscribe(async (rp: any) => {
        })
      }
    })
  }

  async comission(service: number, tip: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element,
    totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number) {

    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0, totalCommission = 0,
      sumCommission = 0, receivedManager = 0

    this.serviceManager.getEncargada(element[0]['encargada']).subscribe(async (rp: any) => {
      this.terapeutaName = rp[0]
      this.numberDay = rp[0].fijoDia

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

      let fixedTotalDay = this.fixedDay * this.numberDay

      sumComision = Number(totalTreatment) + Number(totalTip) + Number(totalDrink) + Number(totalDrinkTherap) + Number(totalTobacco) + Number(totalVitamin) + Number(totalOther)

      if (sumComision != 0 || sumComision != undefined) {
        sumCommission = Number(sumComision.toFixed(1))
      }

      element.map(item => {
        const numberEncarg = this.settledData.filter(serv => serv)
        receivedManager = numberEncarg.reduce((accumulator, serv) => {
          return accumulator + serv.numberEncarg
        }, 0)
      })

      // let totalLiquidation = sumCommission - Number(receivedManager) + Number(this.regularization)
      let totalLiquidation = this.importe
      totalCommission = sumCommission + fixedTotalDay - Number(receivedManager)

      let sumTherapist = totalCash + totalBizum + totalCard + totalTransaction

      // this.validateNullData()
      await this.thousandPointEdit(totalLiquidation, service, totalTreatment, tip, totalTip, drink, drinkTherapist, totalDrink, totalDrinkTherap, tobacco,
        totalTobacco, vitamins, totalVitamin, others, totalOther, sumCommission, receivedManager, totalCash, totalBizum, totalCard, totalTransaction,
        sumTherapist, fixedTotalDay)

      this.details = true

      if (rp.length == 0) this.totalLiquidation = '0'
    })
  }

  async thousandPointEdit(totalLiquidation: number, service: number, totalTreatment: number, tip: number, totalTip: number, drink: number, drinkTherap: number, totalDrink: number,
    totalDrinkTherap: number, tobacco: number, totalTobacco: number, vitamins: number, totalVitamin: number, others: number, totalOther: number, sumCommission: number,
    receivedManager: number, totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number, sumTherapist: number, fixedTotalDay: number) {

    if (totalLiquidation > 999) {

      const coma = totalLiquidation.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalLiquidation.toString().split(".") : totalLiquidation.toString().split("");
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
      this.totalLiquidation = integer[0].toString()
    } else {
      this.totalLiquidation = totalLiquidation.toString()
    }

    if (service > 999) {

      const coma = service.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? service.toString().split(".") : service.toString().split("");
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
      this.totalService = integer[0].toString()
    } else {
      this.totalService = service.toString()
    }

    if (totalTreatment > 999) {

      const coma = totalTreatment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalTreatment.toString().split(".") : totalTreatment.toString().split("");
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
      this.totalTreatment = integer[0].toString()
    } else {
      this.totalTreatment = totalTreatment.toString()
    }

    if (tip > 999) {

      const coma = tip.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? tip.toString().split(".") : tip.toString().split("");
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
      this.totalTipValue = integer[0].toString()
    } else {
      this.totalTipValue = tip.toString()
    }

    if (totalTip > 999) {

      const coma = totalTip.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalTip.toString().split(".") : totalTip.toString().split("");
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
      this.totalTip = integer[0].toString()
    } else {
      this.totalTip = totalTip.toString()
    }

    if (drink > 999) {

      const coma = drink.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? drink.toString().split(".") : drink.toString().split("");
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
      this.totalValueDrink = integer[0].toString()
    } else {
      this.totalValueDrink = drink.toString()
    }

    if (drinkTherap > 999) {

      const coma = drinkTherap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? drinkTherap.toString().split(".") : drinkTherap.toString().split("");
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
      this.totalValueDrinkTherap = integer[0].toString()
    } else {
      this.totalValueDrinkTherap = drinkTherap.toString()
    }

    if (totalDrink > 999) {

      const coma = totalDrink.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalDrink.toString().split(".") : totalDrink.toString().split("");
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
      this.totalDrink = integer[0].toString()
    } else {
      this.totalDrink = totalDrink.toString()
    }

    if (totalDrinkTherap > 999) {

      const coma = totalDrinkTherap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalDrinkTherap.toString().split(".") : totalDrinkTherap.toString().split("");
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
      this.totalDrinkTherap = integer[0].toString()
    } else {
      this.totalDrinkTherap = totalDrinkTherap.toString()
    }

    if (tobacco > 999) {

      const coma = tobacco.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? tobacco.toString().split(".") : tobacco.toString().split("");
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
      this.totalTobaccoValue = integer[0].toString()
    } else {
      this.totalTobaccoValue = tobacco.toString()
    }

    if (totalTobacco > 999) {

      const coma = totalTobacco.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalTobacco.toString().split(".") : totalTobacco.toString().split("");
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
      this.totalTobacco = integer[0].toString()
    } else {
      this.totalTobacco = totalTobacco.toString()
    }

    if (vitamins > 999) {

      const coma = vitamins.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? vitamins.toString().split(".") : vitamins.toString().split("");
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
      this.totalValueVitamins = integer[0].toString()
    } else {
      this.totalValueVitamins = vitamins.toString()
    }

    if (totalVitamin > 999) {

      const coma = totalVitamin.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalVitamin.toString().split(".") : totalVitamin.toString().split("");
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
      this.totalVitamin = integer[0].toString()
    } else {
      this.totalVitamin = totalVitamin.toString()
    }

    if (others > 999) {

      const coma = others.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? others.toString().split(".") : others.toString().split("");
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
      this.totalValueOther = integer[0].toString()
    } else {
      this.totalValueOther = others.toString()
    }

    if (totalOther > 999) {

      const coma = totalOther.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalOther.toString().split(".") : totalOther.toString().split("");
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
      this.totalOther = integer[0].toString()
    } else {
      this.totalOther = totalOther.toString()
    }

    if (sumCommission > 999) {

      const coma = sumCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? sumCommission.toString().split(".") : sumCommission.toString().split("");
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
      this.totalSum = integer[0].toString()
    } else {
      this.totalSum = sumCommission.toString()
    }

    if (receivedManager > 999) {

      const coma = receivedManager.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? receivedManager.toString().split(".") : receivedManager.toString().split("");
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
      this.totalReceived = integer[0].toString()
    } else {
      this.totalReceived = receivedManager.toString()
    }

    for (let o = 0; o < this.settledData?.length; o++) {
      if (this.settledData[o]?.servicio > 999) {

        const coma = this.settledData[o]?.servicio.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.servicio.toString().split(".") : this.settledData[o]?.servicio.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['servicio'] = integer[0].toString()
      } else {
        this.settledData[o]['servicio'] = this.settledData[o]?.servicio
      }

      if (this.settledData[o]?.propina > 999) {

        const coma = this.settledData[o]?.propina.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.propina.toString().split(".") : this.settledData[o]?.propina.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['propina'] = integer[0].toString()
      } else {
        this.settledData[o]['propina'] = this.settledData[o]?.propina
      }

      if (this.settledData[o]?.numberTerap > 999) {

        const coma = this.settledData[o]?.numberTerap.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.numberTerap.toString().split(".") : this.settledData[o]?.numberTerap.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['numberTerap'] = integer[0].toString()
      } else {
        this.settledData[o]['numberTerap'] = this.settledData[o]?.numberTerap
      }

      if (this.settledData[o]?.bebidas > 999) {

        const coma = this.settledData[o]?.bebidas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.bebidas.toString().split(".") : this.settledData[o]?.bebidas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['bebidas'] = integer[0].toString()
      } else {
        this.settledData[o]['bebidas'] = this.settledData[o]?.bebidas
      }

      if (this.settledData[o]?.tabaco > 999) {

        const coma = this.settledData[o]?.tabaco.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.tabaco.toString().split(".") : this.settledData[o]?.tabaco.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['tabaco'] = integer[0].toString()
      } else {
        this.settledData[o]['tabaco'] = this.settledData[o]?.tabaco
      }

      if (this.settledData[o]?.vitaminas > 999) {

        const coma = this.settledData[o]?.vitaminas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.vitaminas.toString().split(".") : this.settledData[o]?.vitaminas.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['vitaminas'] = integer[0].toString()
      } else {
        this.settledData[o]['vitaminas'] = this.settledData[o]?.vitaminas
      }

      if (this.settledData[o]?.otros > 999) {

        const coma = this.settledData[o]?.otros.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.settledData[o]?.otros.toString().split(".") : this.settledData[o]?.otros.toString().split("");
        let integer = coma ? array[o].split("") : array;
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
        this.settledData[o]['otros'] = integer[0].toString()
      } else {
        this.settledData[o]['otros'] = this.settledData[o]?.otros
      }
    }

    if (totalCash > 999) {

      const coma = totalCash.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalCash.toString().split(".") : totalCash.toString().split("");
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
      this.totalCash = integer[0].toString()
    } else {
      this.totalCash = totalCash.toString()
    }

    if (totalBizum > 999) {

      const coma = totalBizum.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalBizum.toString().split(".") : totalBizum.toString().split("");
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
      this.totalBizum = integer[0].toString()
    } else {
      this.totalBizum = totalBizum.toString()
    }

    if (totalCard > 999) {

      const coma = totalCard.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalCard.toString().split(".") : totalCard.toString().split("");
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
      this.totalCard = integer[0].toString()
    } else {
      this.totalCard = totalCard.toString()
    }

    if (totalTransaction > 999) {

      const coma = totalTransaction.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? totalTransaction.toString().split(".") : totalTransaction.toString().split("");
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
      this.totalTransaction = integer[0].toString()
    } else {
      this.totalTransaction = totalTransaction.toString()
    }

    if (sumTherapist > 999) {

      const coma = sumTherapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? sumTherapist.toString().split(".") : sumTherapist.toString().split("");
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
      this.sumTherapist = integer[0].toString()
    } else {
      this.sumTherapist = sumTherapist.toString()
    }

    if (fixedTotalDay > 999) {

      const coma = fixedTotalDay.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? fixedTotalDay.toString().split(".") : fixedTotalDay.toString().split("");
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
      this.totalFixedDay = integer[0].toString()
    } else {
      this.totalFixedDay = fixedTotalDay.toString()
    }
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
        this.modelServices.idEncargada = ""
        this.modelServices.liquidadoEncargada = false
        this.services.updateManagerSettlementManagerIdByManagerId(this.idManager, this.modelServices).subscribe(async (rp) => {
          this.serviceLiquidation.deleteLiquidationManager(this.idDetail).subscribe(async (rp) => {
            if (this.administratorRole == true) {
              await this.getLiquidation()
            }
            else {
              await this.consultLiquidationManager()
            }

            this.details = false
          })
        })
      }
    })
  }
}