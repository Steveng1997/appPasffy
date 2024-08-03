import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import dayjs from "dayjs";

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

  manager = []
  selectedEncargada: string
  selectedFormPago: string

  id: number
  liquidated: any

  CurrenDate = dayjs().format("YYYY-MM-DD")
  dateToday = dayjs().format("YYYY-MM-DD")
  dateTodayCurrent: string
  dateStart: string
  dateEnd: string
  fechaInicio: string
  fechaFinal: string
  horaInicio: string
  horaFinal: string
  day: number
  month: string
  nameMonth: string
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
    amount: 0,
    company: "",
    currentDate: 0,
    dateStart: "",
    dateEnd: "",
    manager: "",
    payment: "",
    therapist: "",
    treatment: 0,
    uniqueId: "",
    idTherap: ""
  }

  modelServices: ModelService = {
    idTherap: "",
    screen: ""
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

    await this.getLiquidation()
    this.getTerapeuta()

    if (this.id) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getId(this.id).subscribe((rp) => {
      this.company = rp['manager'].company
      if (rp['manager'].rol == 'Administrador') {
        this.administratorRole = true
        this.getManager()
      } else {
        this.manager = [rp['manager']]
        this.administratorRole = false
        this.selectedEncargada = rp['manager'].name
        this.liquidationTherapist.manager = this.manager[0].name
        this.serviceLiquidation.getByManagerAndCompany(this.liquidationTherapist.manager, rp['manager'].company).subscribe(async (rp: any) => {
          this.liquidated = rp['liquidTherapist']
        })
      }
    })
  }

  async consultLiquidationTherapistByManager() {
    this.serviceLiquidation.getByManagerAndCompany(this.liquidationTherapist.manager, this.company).subscribe(async (rp) => {
      this.liquidated = rp
      this.total(rp)
      this.liquidationTherapist.manager = ""
      this.liquidationTherapist.therapist = ""
    })
  }

  getLiquidation = async () => {
    let day = '', month = '', year = ''
    this.dateTodayCurrent = 'HOY'

    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.company = rp['manager'].company
      this.serviceLiquidation.getByCompany(rp['manager'].company).subscribe(async (rp: any) => {

        for (let i = 0; i < rp['liquidTherapist'].length; i++) {
          rp['liquidTherapist'][i].hourStart = rp['liquidTherapist'][i].dateStart.substring(11, 16)
          day = rp['liquidTherapist'][i].dateStart.substring(8, 10)
          month = rp['liquidTherapist'][i].dateStart.substring(5, 7)
          year = rp['liquidTherapist'][i].dateStart.substring(2, 4)
          rp['liquidTherapist'][i].date = `${day}-${month}-${year}`

          rp['liquidTherapist'][i].hourEnd = rp['liquidTherapist'][i].dateEnd.substring(11, 16)
          day = rp['liquidTherapist'][i].dateEnd.substring(8, 10)
          month = rp['liquidTherapist'][i].dateEnd.substring(5, 7)
          year = rp['liquidTherapist'][i].dateEnd.substring(2, 4)
          rp['liquidTherapist'][i].date2 = `${day}-${month}-${year}`
        }

        this.liquidated = rp['liquidTherapist']
      })
    })
  }

  getTerapeuta() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.serviceTherapist.company(rp['manager'].company).subscribe((rp: any) => {
        this.terapeuta = rp['therapist']
      })
    })
  }

  getManager() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.serviceManager.company(rp['manager'].company).subscribe((rp: any) => {
        this.manager = rp['manager']
      })
    })
  }

  filters = async () => {
    this.serviceLiquidation.getByCompany(this.company).subscribe((rp: any) => {
      this.liquidated = rp['liquidTherapist']
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

    let day = '', month = '', year = ''

    for (let i = 0; i < this.liquidated.length; i++) {
      this.liquidated[i].hourStart = this.liquidated[i].dateStart.substring(11, 16)
      day = this.liquidated[i].dateStart.substring(8, 10)
      month = this.liquidated[i].dateStart.substring(5, 7)
      year = this.liquidated[i].dateStart.substring(2, 4)
      this.liquidated[i].date = `${day}-${month}-${year}`

      this.liquidated[i].hourEnd = this.liquidated[i].dateEnd.substring(11, 16)
      day = this.liquidated[i].dateEnd.substring(8, 10)
      month = this.liquidated[i].dateEnd.substring(5, 7)
      year = this.liquidated[i].dateEnd.substring(2, 4)
      this.liquidated[i].date2 = `${day}-${month}-${year}`
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
    let currentDate = ''
    let day = this.dateToday.substring(8, 10)
    let month = this.dateToday.substring(5, 7)
    let year = this.dateToday.substring(0, 4)
    let dateToday = `${year}-${month}-${day}`

    this.dateStart = dateToday
    this.dateEnd = dateToday
    currentDate = dateToday

    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      if (rp['manager'].rol == 'Administrador') {
        this.serviceLiquidation.getDateCurrentDay(currentDate, rp['manager'].company).subscribe((rp: any) => {
          this.liquidated = rp['liquidTherapist']
          this.total(rp['liquidTherapist'])
        })
      } else {
        this.serviceLiquidation.getTodayDateAndManager(currentDate, rp['manager'].name, this.company).subscribe((rp: any) => {
          this.liquidated = rp['liquidTherapist']
          this.total(rp['liquidTherapist'])
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
        this.modelServices.screen = 'liquidation-therapist'
        this.services.updateScreen(rp[0]['id'], this.modelServices).subscribe(async (rp: any) => { })
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
    let imports = 0

    if (rp.length > 0)
      imports = rp.map(({ amount }) => amount).reduce((acc, value) => acc + value, 0)

    if (imports > 999)
      this.totalImport = (imports / 1000).toFixed(3)
    else if (imports == 0)
      this.totalImport = '0'
    else
      this.totalImport = imports.toString()
  }

  backArrow = async () => {
    let fechaEnd = '', diaHoy = '', mesHoy = '', añoHoy = '', fechaHoy = '', fechaActualmente = ''

    diaHoy = this.dateToday.substring(8, 10)
    mesHoy = this.dateToday.substring(5, 7)
    añoHoy = this.dateToday.substring(0, 4)
    fechaEnd = `${añoHoy}-${mesHoy}-${diaHoy}`

    this.fechaFormat.setDate(this.fechaFormat.getDate() - 1)
    let day = this.fechaFormat.toString().substring(8, 10)
    let monthName = this.fechaFormat.toString().substring(4, 7)
    let year = this.fechaFormat.toString().substring(11, 15)

    this.day = Number(day)
    this.months(monthName)
    let month = this.month

    fechaHoy = `${añoHoy}-${month}-${day}`

    if (fechaEnd == fechaHoy) {
      this.today = true
      this.dateTodayCurrent = 'HOY'
    } else {
      this.today = false
    }

    this.month = this.nameMonth
    fechaActualmente = `${year}-${month}-${this.day}`
    this.dateStart = fechaActualmente
    this.dateEnd = fechaEnd

    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      if (rp['manager'].rol == 'Administrador') {

        this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
          if (rp['liquidTherapist'].length > 0) {

            for (let i = 0; i < rp['liquidTherapist'].length; i++) {
              rp['liquidTherapist'][i].hourStart = rp['liquidTherapist'][i].dateStart.substring(11, 16)
              day = rp['liquidTherapist'][i].dateStart.substring(8, 10)
              month = rp['liquidTherapist'][i].dateStart.substring(5, 7)
              year = rp['liquidTherapist'][i].dateStart.substring(2, 4)
              rp['liquidTherapist'][i].date = `${day}-${month}-${year}`

              rp['liquidTherapist'][i].hourEnd = rp['liquidTherapist'][i].dateEnd.substring(11, 16)
              day = rp['liquidTherapist'][i].dateEnd.substring(8, 10)
              month = rp['liquidTherapist'][i].dateEnd.substring(5, 7)
              year = rp['liquidTherapist'][i].dateEnd.substring(2, 4)
              rp['liquidTherapist'][i].date2 = `${day}-${month}-${year}`
            }

            this.liquidated = rp
            this.total(rp)
          }
        })
      } else {
        this.serviceLiquidation.getTodayDateAndManager(fechaActualmente, rp['manager'].name, this.company).subscribe((rp: any) => {
          if (rp['liquidTherapist'].length > 0) {

            for (let i = 0; i < rp['liquidTherapist'].length; i++) {
              rp['liquidTherapist'][i].hourStart = rp['liquidTherapist'][i].dateStart.substring(11, 16)
              day = rp['liquidTherapist'][i].dateStart.substring(8, 10)
              month = rp['liquidTherapist'][i].dateStart.substring(5, 7)
              year = rp['liquidTherapist'][i].dateStart.substring(2, 4)
              rp['liquidTherapist'][i].date = `${day}-${month}-${year}`

              rp['liquidTherapist'][i].hourEnd = rp['liquidTherapist'][i].dateEnd.substring(11, 16)
              day = rp['liquidTherapist'][i].dateEnd.substring(8, 10)
              month = rp['liquidTherapist'][i].dateEnd.substring(5, 7)
              year = rp['liquidTherapist'][i].dateEnd.substring(2, 4)
              rp['liquidTherapist'][i].date2 = `${day}-${month}-${year}`
            }

            this.liquidated = rp
            this.total(rp)
          }
        })
      }

      return true
    })

    return false
  }

  nextArrow = async () => {
    let fechaEnd = '', diaHoy = '', mesHoy = '', añoHoy = '', monthEnd = '', fechaHoy = '', fechaActualmente = ''

    diaHoy = this.dateToday.substring(8, 10)
    mesHoy = this.dateToday.substring(5, 7)
    añoHoy = this.dateToday.substring(0, 4)
    fechaEnd = `${añoHoy}-${mesHoy}-${diaHoy}`

    this.fechaFormat.setDate(this.fechaFormat.getDate() + 1)
    let day = this.fechaFormat.toString().substring(8, 10)
    let monthName = this.fechaFormat.toString().substring(4, 7)
    let year = this.fechaFormat.toString().substring(11, 15)

    this.day = Number(day)
    this.months(monthName)
    let month = this.month

    fechaHoy = `${year}-${month}-${day}`

    if (fechaEnd == fechaHoy) {
      this.today = true
      this.dateTodayCurrent = 'HOY'
    } else {
      this.today = false
    }

    this.month = this.nameMonth
    fechaActualmente = `${year}-${month}-${day}`
    this.dateStart = fechaActualmente
    this.dateEnd = fechaEnd

    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      if (rp['manager'].rol == 'Administrador') {

        this.serviceLiquidation.getDateCurrentDay(fechaActualmente, this.company).subscribe((rp: any) => {
          if (rp['liquidTherapist'].length > 0) {
            this.liquidated = rp['liquidTherapist']
            this.total(rp['liquidTherapist'])
          }
        })
      } else {
        this.serviceLiquidation.getTodayDateAndManager(fechaActualmente, rp['manager'].name, this.company).subscribe((rp: any) => {
          this.liquidated = rp['liquidTherapist']
          this.total(rp['liquidTherapist'])
        })
      }
      return true
    })
    return false
  }

  months(month: string) {

    if (month == 'Dec') {
      this.month = '12'
      this.nameMonth = 'Diciembre'
    }

    if (month == 'Nov') {
      this.month = '11'
      this.nameMonth = 'Noviembre'
    }

    if (month == 'Oct') {
      this.month = '10'
      this.nameMonth = 'Octubre'
    }

    if (month == 'Sep') {
      this.month = '09'
      this.nameMonth = 'Septiembre'
    }

    if (month == 'Aug') {
      this.month = '08'
      this.nameMonth = 'Agosto'
    }

    if (month == 'Jul') {
      this.month = '07'
      this.nameMonth = 'Julio'
    }

    if (month == 'Jun') {
      this.month = '06'
      this.nameMonth = 'Junio'
    }

    if (month == 'May') {
      this.month = '05'
      this.nameMonth = 'Mayo'
    }

    if (month == 'Apr') {
      this.month = '04'
      this.nameMonth = 'Abril'
    }

    if (month == 'Mar') {
      this.month = '03'
      this.nameMonth = 'Marzo'
    }

    if (month == 'Feb') {
      this.month = '02'
      this.nameMonth = 'Febrero'
    }

    if (month == 'Jan') {
      this.month = '01'
      this.nameMonth = 'Enero'
    }
  }

  // details

  detail(id: string) {
    if (this.details == true) {
      this.details = false
    } else {

      this.serviceLiquidation.getByIdTherapist(id).subscribe(async (rp) => {
        this.nameTherapist = rp['liquidTherapist'][0].therapist
        this.sinceDate = rp['liquidTherapist'][0].dateStart.substring(0, 10)
        this.sinceTime = rp['liquidTherapist'][0].dateStart.substring(11, 16)
        this.toDate = rp['liquidTherapist'][0].dateEnd.substring(0, 10)
        this.untilTime = rp['liquidTherapist'][0].dateEnd.substring(11, 16)
        this.payment = rp['liquidTherapist'][0].payment
        this.idDetail = rp['liquidTherapist'][0].id
        this.idTherapist = rp['liquidTherapist'][0].idTherap

        await this.sumTotal(id)
      })
    }
  }

  async sumTotal(id: string) {
    let day = '', month = '', year = ''

    this.services.getByIdTherapist(id).subscribe(async (rp: any) => {
      if (rp.status == 200) {
        for (let i = 0; i < rp['service'].length; i++) {
          rp['service'][i].hourStart = rp['service'][i].dateStart.substring(11, 16)
          day = rp['service'][i].dateStart.substring(8, 10)
          month = rp['service'][i].dateStart.substring(5, 7)
          year = rp['service'][i].dateStart.substring(2, 4)
          rp['service'][i].date = `${day}-${month}-${year}`

          rp['service'][i].hourEnd = rp['service'][i].dateEnd.substring(11, 16)
          day = rp['service'][i].dateEnd.substring(8, 10)
          month = rp['service'][i].dateEnd.substring(5, 7)
          year = rp['service'][i].dateEnd.substring(2, 4)
        }

        this.settledData = rp['service']

        // Filter by servicio
        const servicios = rp['service'].filter(serv => serv)
        const service = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.service
        }, 0)

        // Filter by Propina
        const propinas = rp['service'].filter(serv => serv)
        let tip = propinas.reduce((accumulator, serv) => {
          return accumulator + serv.tip
        }, 0)

        // Filter by Bebida
        const bebida = rp['service'].filter(serv => serv)
        let drink = bebida.reduce((accumulator, serv) => {
          return accumulator + serv.drink
        }, 0)

        // Filter by Bebida
        const drinkTherap = rp['service'].filter(serv => serv)
        let drinkTherapist = drinkTherap.reduce((accumulator, serv) => {
          return accumulator + serv.drinkTherapist
        }, 0)

        // Filter by Tabaco
        const tabac = rp['service'].filter(serv => serv)
        let tobacco = tabac.reduce((accumulator, serv) => {
          return accumulator + serv.tabacco
        }, 0)

        // Filter by Vitamina
        const vitamina = rp['service'].filter(serv => serv)
        let vitamins = vitamina.reduce((accumulator, serv) => {
          return accumulator + serv.vitamin
        }, 0)

        // Filter by Vitamina
        const otroServicio = rp['service'].filter(serv => serv)
        let others = otroServicio.reduce((accumulator, serv) => {
          return accumulator + serv.others
        }, 0)

        // Filter by totalCash
        const totalCashs = rp['service'].filter(serv => serv)
        let totalCash = totalCashs.reduce((accumulator, serv) => {
          return accumulator + serv.valueCash
        }, 0)

        // Filter by totalBizum
        const totalBizums = rp['service'].filter(serv => serv)
        let totalBizum = totalBizums.reduce((accumulator, serv) => {
          return accumulator + serv.valueBizuTherapist
        }, 0)

        // Filter by totalCard
        const totalCards = rp['service'].filter(serv => serv)
        let totalCard = totalCards.reduce((accumulator, serv) => {
          return accumulator + serv.valueCardTherapist
        }, 0)

        // Filter by totalTransaction
        const totalTransactions = rp['service'].filter(serv => serv)
        let totalTransaction = totalTransactions.reduce((accumulator, serv) => {
          return accumulator + serv.valueTransactionTherapist
        }, 0)

        this.comission(service, tip, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)
      } else {
        await this.serviceLiquidation.getByIdTherapist(id).subscribe(async (rp: any) => {
        })
      }
    })
  }

  async comission(service: number, tip: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element,
    totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number) {

    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0, totalCommission = 0,
      sumCommission = 0, receivedTherapist = 0

    this.serviceTherapist.name(element['service'][0].therapist).subscribe(async (rp: any) => {
      this.terapeutaName = rp['therapist']

      // Comision
      comisiServicio = service / 100 * rp['therapist'][0]?.service
      comiPropina = tip / 100 * rp['therapist'][0]?.tip
      comiBebida = drink / 100 * rp['therapist'][0]?.drink
      comiBebidaTherapist = drinkTherapist / 100 * rp['therapist'][0]?.drinkTherapist
      comiTabaco = tobacco / 100 * rp['therapist'][0]?.tabacco
      comiVitamina = vitamins / 100 * rp['therapist'][0]?.vitamin
      comiOtros = others / 100 * rp['therapist'][0]?.others

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

      element['service'].map(item => {
        const numbTerap = this.settledData.filter(serv => serv)
        receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTherapist
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

      if (this.settledData[o]?.service > 999)
        this.settledData[o]['service'] = (this.settledData[o]?.service / 1000).toFixed(3)
      else
        this.settledData[o]['service'] = this.settledData[o]?.service.toString()

      if (this.settledData[o]?.tip > 999)
        this.settledData[o]['tip'] = (this.settledData[o]?.tip / 1000).toFixed(3)
      else
        this.settledData[o]['tip'] = this.settledData[o]?.tip.toString()

      if (this.settledData[o]?.numberTherapist > 999)
        this.settledData[o]['numberTherapist'] = (this.settledData[o]?.numberTherapist / 1000).toFixed(3)
      else
        this.settledData[o]['numberTherapist'] = this.settledData[o]?.numberTherapist.toString()

      if (this.settledData[o]?.drink > 999)
        this.settledData[o]['drink'] = (this.settledData[o]?.drink / 1000).toFixed(3)
      else
        this.settledData[o]['drink'] = this.settledData[o]?.drink.toString()

      if (this.settledData[o]?.tabacco > 999)
        this.settledData[o]['tabacco'] = (this.settledData[o]?.tabacco / 1000).toFixed(3)
      else
        this.settledData[o]['tabacco'] = this.settledData[o]?.tabacco.toString()

      if (this.settledData[o]?.vitamin > 999)
        this.settledData[o]['vitamin'] = (this.settledData[o]?.vitamin / 1000).toFixed(3)
      else
        this.settledData[o]['vitamin'] = this.settledData[o]?.vitamin.toString()

      if (this.settledData[o]?.others > 999)
        this.settledData[o]['others'] = (this.settledData[o]?.others / 1000).toFixed(3)
      else
        this.settledData[o]['others'] = this.settledData[o]?.others.toString()
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
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      if (rp['manager'].rol == 'Administrador') {
        this.serviceLiquidation.getDateCurrentDay(this.dateStart, this.company).subscribe((rp: any) => {
          this.liquidated = rp['liquidTherapist']
          this.total(rp['liquidTherapist'])
        })
      } else {
        this.serviceLiquidation.getTodayDateAndManager(this.dateStart, this.nameTherapist, this.company).subscribe((rp: any) => {
          this.liquidated = rp['liquidTherapist']
          this.total(rp['liquidTherapist'])
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
        this.modelServices.idTherap = ""
        this.modelServices.liquidatedTherapist = false
        this.services.updateLiquidatedTherapistByIdTherap(this.idTherapist, this.modelServices).subscribe(async (rp) => {
          this.serviceLiquidation.delete(this.idDetail).subscribe(async (rp) => {
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