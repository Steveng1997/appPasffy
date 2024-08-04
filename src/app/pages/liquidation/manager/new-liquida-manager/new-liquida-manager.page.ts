import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment'
import dayjs from "dayjs";

// Models
import { LiquidationManager } from 'src/app/core/models/liquidationManager';
import { ModelService } from 'src/app/core/models/service';

// Service
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { ServiceService } from 'src/app/core/services/service/service.service';
import { ServiceLiquidationManagerService } from 'src/app/core/services/liquidation/service-liquidation-manager.service';


@Component({
  selector: 'app-new-liquida-manager',
  templateUrl: './new-liquida-manager.page.html',
  styleUrls: ['./new-liquida-manager.page.scss'],
})
export class NewLiquidaManagerPage implements OnInit {

  page!: number

  dates: boolean = false
  selected: boolean = false
  administratorRole: boolean = false

  terapeuta: any
  unliquidatedService: any
  manager = []
  receivedManager: any

  id: number
  liquidated: any

  // Tables
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
  sumCommission2: number

  // Total de todo
  totalSum: string
  sumTherapist: string
  totalReceived: string

  fixedDay: number
  totalFixedDay: string
  totalServices: string

  currentDate = new Date().getTime()
  dateStart: string
  dateEnd: string
  hourStart: string
  hourEnd: string

  fijoDia: number
  fixedTotalDay: number
  letterFixedDay = ""

  modelServices: ModelService = {
    idManag: ""
  }

  modelLiquidation: LiquidationManager = {
    amount: 0,
    company: "",
    currentDate: 0,
    dateStart: "",
    dateEnd: dayjs().format("YYYY-MM-DD HH:mm"),
    fixeDay: 0,
    id: 0,
    idManag: "",
    manager: "",
    treatment: 0,
    uniqueId: ""
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private service: ServiceService,
    private serviceManager: ManagerService,
    private serviceLiquidation: ServiceLiquidationManagerService
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])
    document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
    this.dates = false
    this.selected = false

    if (this.id) {
      this.validitingUser()
    }
  }

  validitingUser() {
    this.serviceManager.getId(this.id).subscribe((rp) => {
      this.company = rp['manager'].company
      if (rp['manager'].rol == 'Administrador') {
        this.administratorRole = true
        this.GetAllManagers()
      } else {
        this.manager = [rp['manager']]
        this.administratorRole = false
        this.modelLiquidation.manager = rp['manager'].name
        this.modelLiquidation.company = this.company
        this.serviceLiquidation.getByManager(this.modelLiquidation.manager).subscribe(async (rp) => {
          this.liquidated = rp
          this.calculateServices()
        })
      }
    })
  }

  GetAllManagers() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.modelLiquidation.company = rp['manager'].company
      this.serviceManager.company(rp['manager'].company).subscribe((rp: any) => {
        this.manager = rp['manager']
      })
    })
  }

  async getThoseThatNotLiquidated() {
    this.service.getByLiquidateManagerFalse().subscribe(async (datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = ''

    await this.serviceLiquidation.getByManager(this.modelLiquidation.manager).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        fromDay = rp[0]['dateEnd'].substring(0, 2)
        fromMonth = rp[0]['dateEnd'].substring(3, 5)
        fromYear = rp[0]['dateEnd'].substring(6, 8)

        this.modelLiquidation.dateStart = `${'20' + fromYear}-${fromMonth}-${fromDay}`
        this.modelLiquidation.dateStart = rp[0]['dateEnd']
        await this.inputDateAndTime(false, null)
      } else {
        await this.dateDoesNotExist()
      }
    })
  }

  async dateDoesNotExist() {
    let year = "", month = "", day = "", hour = ""

    await this.service.getByManagerAndNotLiquidatedManagerCurrentDateAsc(this.modelLiquidation.manager).subscribe(async (rp) => {
      year = rp['service'][0].dateToday.substring(0, 4)
      month = rp['service'][0].dateToday.substring(5, 7)
      day = rp['service'][0].dateToday.substring(8, 10)
      hour = rp['service'][0].dateToday.substring(11, 16)
      this.modelLiquidation.dateStart = `${year}-${month}-${day} ${hour}`
      await this.inputDateAndTime(false, null)
    })
  }

  calculateServices() {
    if (this.modelLiquidation.manager != "") {
      this.getThoseThatNotLiquidated()
      this.ionLoaderService.simpleLoader()

      this.service.getByManagerNotLiquidatedManager(this.modelLiquidation.manager).subscribe(async (rp: any) => {
        if (rp['service'].length > 0) {
          this.dates = false
          this.ionLoaderService.dismissLoader()
          await this.dateExists()
        } else {
          this.dates = false
          this.selected = false
          this.ionLoaderService.dismissLoader()
          document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
          document.getElementById('overviewDates').style.height = '109px'
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No existe ningun servicio para liquidar', showConfirmButton: false, timer: 2500 })
        }
      })
    } else {
      this.dates = false
    }
  }

  async inputDateAndTime(event, date) {
    if (event == true) {
      if (date == 'start')
        this.modelLiquidation.dateStart = `${this.dateStart} ${this.hourStart}`
      else
        this.modelLiquidation.dateEnd = `${this.dateEnd} ${this.hourEnd}`
    }

    this.dateStart = this.modelLiquidation.dateStart.substring(0, 10)
    this.dateEnd = this.modelLiquidation.dateEnd.substring(0, 10)
    this.hourStart = this.modelLiquidation.dateStart.substring(11, 16)
    this.hourEnd = this.modelLiquidation.dateEnd.substring(11, 16)

    this.service.getByManagerAndDateStartAndDateEndAndCompany(this.modelLiquidation.manager, this.modelLiquidation.dateStart, this.modelLiquidation.dateEnd,
      this.modelLiquidation.company).subscribe(async (rp: any) => {

        if (rp['service'].length > 0) {
          this.unliquidatedService = rp['service']

          // Filter by servicio
          const servicios = rp['service'].filter(serv => serv)
          let service = servicios.reduce((accumulator, serv) => {
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
            return accumulator + serv.valueEfectManager
          }, 0)

          // Filter by totalBizum
          const totalBizums = rp['service'].filter(serv => serv)
          let totalBizum = totalBizums.reduce((accumulator, serv) => {
            return accumulator + serv.valueBizuManager
          }, 0)

          // Filter by totalCard
          const totalCards = rp['service'].filter(serv => serv)
          let totalCard = totalCards.reduce((accumulator, serv) => {
            return accumulator + serv.valueCardManager
          }, 0)

          // Filter by totalTransaction
          const totalTransactions = rp['service'].filter(serv => serv)
          let totalTransaction = totalTransactions.reduce((accumulator, serv) => {
            return accumulator + serv.valueTransactionManager
          }, 0)

          this.comission(service, tip, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)

        } else {
          this.unliquidatedService = rp['service']
          this.ionLoaderService.dismissLoader()
          this.dates = true
          this.selected = true
          document.getElementById('overviewDates').style.height = '270px'
          document.getElementById('nuevaLiquidation').style.overflowY = 'auto'
          Swal.fire({ heightAuto: false, icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500 })
        }
      })
  }

  async comission(service: number, tip: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element,
    totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number) {

    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0, totalCommission = 0,
      sumCommission = 0, receivedManager = 0

    await this.serviceManager.name(this.modelLiquidation.manager).subscribe(async (rp) => {
      this.terapeutaName = rp['manager'][0]
      this.fijoDia = rp['manager'][0]['fixeDay']
      this.letterFixedDay = this.fijoDia.toString()

      // Comision
      comisiServicio = service / 100 * rp['manager'][0]?.service
      comiPropina = tip / 100 * rp['manager'][0]?.tip
      comiBebida = drink / 100 * rp['manager'][0]?.drink
      comiBebidaTherapist = drinkTherapist / 100 * rp['manager'][0]?.drinkTherapist
      comiTabaco = tobacco / 100 * rp['manager'][0]?.tabacco
      comiVitamina = vitamins / 100 * rp['manager'][0]?.vitamin
      comiOtros = others / 100 * rp['manager'][0]?.others

      let totalTreatment = Number(comisiServicio.toFixed(1))
      let totalTip = Number(comiPropina.toFixed(1))
      let totalDrink = Number(comiBebida.toFixed(1))
      let totalDrinkTherap = Number(comiBebidaTherapist.toFixed(1))
      let totalTobacco = Number(comiTabaco.toFixed(1))
      let totalVitamin = Number(comiVitamina.toFixed(1))
      let totalOther = Number(comiOtros.toFixed(1))

      sumComision = Number(totalTreatment) + Number(totalTip) + Number(totalDrink) + Number(totalDrinkTherap) + Number(totalTobacco) + Number(totalVitamin) + Number(totalOther)

      if (sumComision != 0 || sumComision != undefined) {
        this.sumCommission2 = Math.ceil(sumComision)
        sumCommission = Number(sumComision.toFixed(1))
      }

      element['service'].map(item => {
        const numbTerap = this.unliquidatedService.filter(serv => serv)
        receivedManager = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberManager
        }, 0)
      })

      this.calculateTheDays()
      this.fixedTotalDay = this.fixedDay * this.fijoDia
      this.pountFixedDay()

      this.receivedManager = receivedManager

      let totalLiquidation = Math.ceil(sumCommission) + this.fixedTotalDay - Number(receivedManager)
      let totalServices = Math.ceil(sumCommission) - Number(receivedManager)
      this.modelLiquidation.amount = totalLiquidation

      let sumTherapist = totalCash + totalBizum + totalCard + totalTransaction

      this.ionLoaderService.dismissLoader()

      await this.thousandPoint(totalLiquidation, service, totalTreatment, tip, totalTip, drink, drinkTherapist, totalDrink, totalDrinkTherap, tobacco,
        totalTobacco, vitamins, totalVitamin, others, totalOther, sumCommission, receivedManager, totalCash, totalBizum, totalCard, totalTransaction, sumTherapist, totalServices)

      this.dates = true
      this.selected = true
      document.getElementById('nuevaLiquidation').style.overflowY = 'auto'
      document.getElementById('overviewDates').style.height = '270px'
    })
  }

  calculateTheDays() {
    let day = '', convertDay = '', month = '', year = '', hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

    dayEnd = this.modelLiquidation.dateStart.substring(8, 10)
    monthEnd = this.modelLiquidation.dateStart.substring(5, 7)
    yearEnd = this.modelLiquidation.dateStart.substring(0, 4)

    var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd}`, "YYYY-MM-DD")

    // Date 2

    day = this.modelLiquidation.dateEnd.substring(8, 10)
    month = this.modelLiquidation.dateEnd.substring(5, 7)
    year = this.modelLiquidation.dateEnd.substring(0, 4)

    var date2 = moment(`${year}-${month}-${day}`, "YYYY-MM-DD")
    this.fixedDay = date2.diff(date1, 'days')
  }

  async thousandPoint(totalLiquidation: number, service: number, totalTreatment: number, tip: number, totalTip: number, drink: number, drinkTherap: number, totalDrink: number,
    totalDrinkTherap: number, tobacco: number, totalTobacco: number, vitamins: number, totalVitamin: number, others: number, totalOther: number, sumCommission: number,
    receivedManager: number, totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number, sumTherapist: number, totalServices: number) {

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

    if (receivedManager > 999)
      this.totalReceived = (receivedManager / 1000).toFixed(3)
    else
      this.totalReceived = receivedManager.toString()

    for (let o = 0; o < this.unliquidatedService?.length; o++) {

      if (this.unliquidatedService[o]?.service > 999)
        this.unliquidatedService[o]['service'] = (this.unliquidatedService[o]?.service / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['service'] = this.unliquidatedService[o]?.service.toString()

      if (this.unliquidatedService[o]?.tip > 999)
        this.unliquidatedService[o]['tip'] = (this.unliquidatedService[o]?.tip / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['tip'] = this.unliquidatedService[o]?.tip.toString()

      if (this.unliquidatedService[o]?.numberTherapist > 999)
        this.unliquidatedService[o]['numberTherapist'] = (this.unliquidatedService[o]?.numberTherapist / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['numberTherapist'] = this.unliquidatedService[o]?.numberTherapist.toString()

      if (this.unliquidatedService[o]?.drink > 999)
        this.unliquidatedService[o]['drink'] = (this.unliquidatedService[o]?.drink / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['drink'] = this.unliquidatedService[o]?.drink.toString()

      if (this.unliquidatedService[o]?.tabacco > 999)
        this.unliquidatedService[o]['tabacco'] = (this.unliquidatedService[o]?.tabacco / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['tabacco'] = this.unliquidatedService[o]?.tabacco.toString()

      if (this.unliquidatedService[o]?.vitamin > 999)
        this.unliquidatedService[o]['vitamin'] = (this.unliquidatedService[o]?.vitamin / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['vitamin'] = this.unliquidatedService[o]?.vitamin.toString()

      if (this.unliquidatedService[o]?.others > 999)
        this.unliquidatedService[o]['others'] = (this.unliquidatedService[o]?.others / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['others'] = this.unliquidatedService[o]?.others.toString()
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

    if (this.fixedTotalDay > 999)
      this.totalFixedDay = (this.fixedTotalDay / 1000).toFixed(3)
    else
      this.totalFixedDay = this.fixedTotalDay.toString()

    if (totalServices > 999)
      this.totalServices = (totalServices / 1000).toFixed(3)
    else
      this.totalServices = totalServices.toString()
  }

  edit(id: number) {
    this.service.getById(id).subscribe((rp: any) => {
      if (rp.length > 0) {
        this.modelServices.screen = 'new-liquiationManager'
        this.service.updateScreen(rp[0]['id'], this.modelServices).subscribe(async (rp: any) => { })
        this.router.navigate([`tabs/${this.id}/edit-services/${rp[0]['id']}`])
      }
    })
  }

  notes() {

  }

  fixedNumberDay(event: any) {
    let numberValue = 0
    numberValue = Number(event.target.value)
    this.modelLiquidation.fixeDay = Number(event.target.value)

    if (numberValue > 0) {
      this.serviceManager.name(this.modelLiquidation.manager).subscribe((resp: any) => {
        this.fijoDia = resp[0]['fijoDia']
        this.letterFixedDay = this.fijoDia.toString()
        this.fixedTotalDay = numberValue * this.fijoDia
        this.pountFixedDay()
        let totalCommission = this.sumCommission2 + this.fixedTotalDay - this.receivedManager
        this.modelLiquidation.amount = totalCommission

        if (totalCommission > 999)
          this.totalLiquidation = (totalCommission / 1000).toFixed(3)
        else
          this.totalLiquidation = totalCommission.toString()
      })
    }
  }

  pountFixedDay() {
    if (this.fixedTotalDay > 999)
      this.totalFixedDay = (this.fixedTotalDay / 1000).toFixed(3)
    else
      this.totalFixedDay = this.fixedTotalDay.toString()
  }

  back() {
    document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
    document.getElementById('overviewDates').style.height = '109px'
    this.dates = false
    this.selected = false
    this.modelLiquidation.manager = ""
    this.ionLoaderService.dismissLoader()
    location.replace(`tabs/${this.id}/liquidation-manager`)
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelServices.idManag = uuid
    this.modelLiquidation.uniqueId = uuid
    this.modelLiquidation.idManag = uuid
    return this.modelLiquidation.uniqueId
  }

  save() {
    if (this.administratorRole == true) {
      debugger
      if (this.modelLiquidation.manager != "") {

        this.createUniqueId()
        this.modelLiquidation.currentDate = this.currentDate

        if (this.modelLiquidation.fixeDay == 0)
          this.modelLiquidation.fixeDay = this.fixedDay

        this.ionLoaderService.simpleLoader()
        this.serviceLiquidation.getByManager(this.modelLiquidation.manager).subscribe((rp: any) => {

          if (rp['liquidManager'].length > 0) {

            for (let o = 0; o < this.unliquidatedService.length; o++) {
              this.modelLiquidation.treatment = this.unliquidatedService.length
              this.modelServices.liquidatedManager = true
              this.service.updateLiquidatedManager(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
            }

            this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
              document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
              document.getElementById('overviewDates').style.height = '109px'
              this.dates = false
              this.selected = false

              if (this.administratorRole == true)
                this.modelLiquidation.manager = ""

              this.ionLoaderService.dismissLoader()
              location.replace(`tabs/${this.id}/liquidation-manager`)
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
            })
          }

          else if (rp['liquidManager'].length == 0) {

            for (let o = 0; o < this.unliquidatedService.length; o++) {
              this.modelLiquidation.treatment = this.unliquidatedService.length
              this.service.updateLiquidatedManager(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
            }

            this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
              document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
              document.getElementById('overviewDates').style.height = '109px'
              this.dates = false
              this.selected = false

              if (this.administratorRole == true)
                this.modelLiquidation.manager = ""

              this.ionLoaderService.dismissLoader()
              location.replace(`tabs/${this.id}/liquidation-manager`)
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
            })
          }
        })
      } else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
      }
    }
  }
}