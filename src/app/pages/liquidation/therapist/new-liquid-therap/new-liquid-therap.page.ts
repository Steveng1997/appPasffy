import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import dayjs from "dayjs";

// Models
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';
import { ModelService } from 'src/app/core/models/service';

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

  page!: number

  dates: boolean = false
  selected: boolean = false
  administratorRole: boolean = false

  terapeuta: any
  unliquidatedService: any
  manager = []

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

  // Total de todo
  totalSum: string
  sumTherapist: string
  totalReceived: string

  currentDate = new Date().getTime()
  dateStart: string
  dateEnd: string
  hourStart: string
  hourEnd: string

  modelServices: ModelService = {
    idTherap: "",
    screen: ""
  }

  modelLiquidation: LiquidationTherapist = {
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
    document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
    this.dates = false
    this.selected = false
    this.getTherapist()
    localStorage.clear()

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
        this.administratorRole = false
        this.manager = [rp['manager']]
        this.modelLiquidation.manager = rp['manager'].name
        this.modelLiquidation.company = this.company
        this.serviceLiquidation.getByManagerAndCompany(this.modelLiquidation.manager, rp['manager'].company).subscribe(async (rp) => {
          this.liquidated = rp['liquidTherapist']
        })
      }
    })
  }

  getManager() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.modelLiquidation.company = rp['manager'].company
      this.serviceManager.company(rp['manager'].company).subscribe((rp: any) => {
        this.manager = rp['manager']
      })
    })
  }

  getTherapist() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.serviceTherapist.company(rp['manager'].company).subscribe((rp: any) => {
        this.terapeuta = rp['therapist']
      })
    })
  }

  bizum() {
    localStorage.setItem('Bizum', 'Bizum')

    if (localStorage.length == 1) {
      if (document.getElementById('bizum1').style.background == "") {
        document.getElementById('bizum1').style.background = '#1fb996'
        this.modelLiquidation.payment = 'Bizum'
      } else {
        document.getElementById('bizum1').style.background = ""
        this.modelLiquidation.payment = ''
        localStorage.removeItem('Bizum')
      }
    } else {
      document.getElementById('bizum1').style.background = ""
      localStorage.removeItem('Bizum')
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
    }
  }

  cash() {
    localStorage.setItem('Efectivo', 'Efectivo')

    if (localStorage.length == 1) {
      if (document.getElementById('cash1').style.background == "") {
        document.getElementById('cash1').style.background = '#1fb996'
        this.modelLiquidation.payment = 'Efectivo'
      } else {
        document.getElementById('cash1').style.background = ""
        this.modelLiquidation.payment = ''
        localStorage.removeItem('Efectivo')
      }
    } else {
      document.getElementById('cash1').style.background = ""
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago', showConfirmButton: false, timer: 2500 })
      localStorage.removeItem('Efectivo')
    }
  }

  card() {
    localStorage.setItem('Tarjeta', 'Tarjeta')

    if (localStorage.length == 1) {
      if (document.getElementById('card1').style.background == "") {
        document.getElementById('card1').style.background = '#1fb996'
        this.modelLiquidation.payment = 'Tarjeta'
      } else {
        document.getElementById('card1').style.background = ""
        this.modelLiquidation.payment = ''
        localStorage.removeItem('Tarjeta')
      }
    } else {
      document.getElementById('card1').style.background = ""
      localStorage.removeItem('Tarjeta')
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
    }
  }

  transaction() {
    localStorage.setItem('Trans', 'Trans')

    if (localStorage.length == 1) {
      if (document.getElementById('transaction1').style.background == "") {
        document.getElementById('transaction1').style.background = '#1fb996'
        this.modelLiquidation.payment = 'Trans'
      } else {
        document.getElementById('transaction1').style.background = ""
        this.modelLiquidation.payment = ''
        localStorage.removeItem('Trans')
      }
    } else {
      document.getElementById('transaction1').style.background = ""
      localStorage.removeItem('Trans')
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
    }
  }

  async getThoseThatNotLiquidated() {
    this.service.getByLiquidateTherapistFalse().subscribe(async (rp) => {
      this.unliquidatedService = rp['service']
    })
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = ''

    await this.serviceLiquidation.getByManagerAndTherapist(this.modelLiquidation.therapist, this.modelLiquidation.manager).subscribe(async (rp: any) => {
      if (rp['liquidTherapist'].length > 0) {
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

    this.modelLiquidation.dateEnd = dayjs().format("YYYY-MM-DD hh:mm")
  }

  async dateDoesNotExist() {
    let year = "", month = "", day = "", hour = ""

    await this.service.getByTherapistAndManagerAndNotLiquidatedTherapistCurrentDateAsc(this.modelLiquidation.therapist, this.modelLiquidation.manager).subscribe(async (rp) => {
      year = rp['service'][0].dateToday.substring(0, 4)
      month = rp['service'][0].dateToday.substring(5, 7)
      day = rp['service'][0].dateToday.substring(8, 10)
      hour = rp['service'][0].dateToday.substring(11, 16)
      this.modelLiquidation.dateStart = `${year}-${month}-${day} ${hour}`
      await this.inputDateAndTime(false, null)
    })
  }

  calculateServices() {
    if (this.modelLiquidation.manager != "" && this.modelLiquidation.therapist != "") {
      this.getThoseThatNotLiquidated()
      this.ionLoaderService.simpleLoader()

      this.service.getByTherapistAndManagerNotLiquidatedTherapist(this.modelLiquidation.therapist, this.modelLiquidation.manager).subscribe(async (rp: any) => {
        if (rp['service'].length > 0) {
          this.dates = false
          this.ionLoaderService.dismissLoader()
          await this.dateExists()
        } else {
          this.dates = false
          this.selected = false
          this.ionLoaderService.dismissLoader()
          document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
          document.getElementById('overviewDates').style.height = '165px'
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

    this.service.getByTherapistAndManagerAndCompany(this.modelLiquidation.therapist,
      this.modelLiquidation.manager, this.modelLiquidation.dateStart, this.modelLiquidation.dateEnd, this.modelLiquidation.company).subscribe(async (rp: any) => {

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

          // Filter by Pago
          const terapeuta = rp['service'].filter(serv => serv)
          let therapistValue = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberTherapist
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
            return accumulator + serv.valueEfectTherapist
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

          this.comission(service, tip, therapistValue, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)

        } else {
          this.unliquidatedService = rp['service']
          this.ionLoaderService.dismissLoader()
          this.dates = false
          this.selected = true
          document.getElementById('overviewDates').style.height = '326px'
          document.getElementById('nuevaLiquidation').style.overflowY = 'auto'
          Swal.fire({ heightAuto: false, icon: 'error', title: 'Oops...', text: 'No hay ningun servicio con la fecha seleccionada', showConfirmButton: false, timer: 2500 })
        }
      })
  }

  async comission(service: number, tip: number, therapistValue: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element,
    totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number) {

    let comisiServicio = 0, comiPropina = 0, comiBebida = 0, comiBebidaTherapist = 0, comiTabaco = 0, comiVitamina = 0, comiOtros = 0, sumComision = 0, totalCommission = 0,
      sumCommission = 0, receivedTherapist = 0

    await this.serviceTherapist.name(this.modelLiquidation.therapist).subscribe(async (rp) => {
      this.terapeutaName = rp['therapist'][0]

      // Comision
      comisiServicio = service / 100 * rp['therapist'][0]?.service
      comiPropina = tip / 100 * rp['therapist'][0]?.tip
      comiBebida = drink / 100 * rp['therapist'][0]?.drink
      comiBebidaTherapist = drinkTherapist / 100 * rp['therapist'][0]?.drinkTherapist
      comiTabaco = tobacco / 100 * rp['therapist'][0]?.tabacco
      comiVitamina = vitamins / 100 * rp['therapist'][0]?.vitamin
      comiOtros = others / 100 * rp['therapist'][0]?.others

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
        const numberTherap = this.unliquidatedService.filter(serv => serv)
        receivedTherapist = numberTherap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTherapist
        }, 0)
      })

      let totalLiquidation = Math.ceil(sumCommission) - Number(receivedTherapist)
      this.modelLiquidation.amount = totalLiquidation

      let sumTherapist = totalCash + totalBizum + totalCard + totalTransaction
      this.ionLoaderService.dismissLoader()

      await this.thousandPoint(totalLiquidation, service, totalTreatment, tip, totalTip, drink, drinkTherapist, totalDrink, totalDrinkTherap, tobacco,
        totalTobacco, vitamins, totalVitamin, others, totalOther, sumCommission, receivedTherapist, totalCash, totalBizum, totalCard, totalTransaction, sumTherapist)

      this.dates = true
      this.selected = true
      document.getElementById('nuevaLiquidation').style.overflowY = 'auto'
      document.getElementById('overviewDates').style.height = '326px'
    })
  }

  async thousandPoint(totalLiquidation: number, service: number, totalTreatment: number, tip: number, totalTip: number, drink: number, drinkTherap: number, totalDrink: number,
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
  }

  edit(id: number) {
    this.service.getById(id).subscribe((rp: any) => {
      if (rp.status == 200) {
        this.modelServices.screen = 'new-liquiationTherapist'
        this.service.updateScreen(rp['service'].id, this.modelServices).subscribe(async (rp: any) => { })
        this.router.navigate([`tabs/${this.id}/edit-services/${rp['service'].id}`])
      }
    })
  }

  notes() {

  }

  back() {
    document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
    document.getElementById('overviewDates').style.height = '165px'
    this.dates = false
    this.selected = false

    if (this.administratorRole == true)
      this.modelLiquidation.manager = ""

    this.modelLiquidation.therapist = ""
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelServices.idTherap = uuid
    this.modelLiquidation.uniqueId = uuid
    this.modelLiquidation.idTherap = uuid
    return this.modelLiquidation.uniqueId
  }

  save() {
    if (this.modelLiquidation.therapist != "") {
      if (this.modelLiquidation.manager != "") {
        if (this.modelLiquidation.payment != "") {

          this.createUniqueId()
          this.modelLiquidation.currentDate = this.currentDate
          this.ionLoaderService.simpleLoader()

          this.serviceLiquidation.getByManagerAndTherapist(this.modelLiquidation.therapist, this.modelLiquidation.manager).subscribe((rp: any) => {

            if (rp['liquidTherapist'].length > 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.modelLiquidation.treatment = this.unliquidatedService.length
                this.modelServices.liquidatedTherapist = true
                this.service.updateLiquidatedTherapist(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
              }

              this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
                this.selected = false
                this.dates = false

                if (this.administratorRole == true)
                  this.modelLiquidation.manager = ""

                this.modelLiquidation.therapist = ""
                localStorage.clear()
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.id}/liquidation-therapist`)
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
              })
            }

            else if (rp['liquidTherapist'].length == 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.modelLiquidation.treatment = this.unliquidatedService.length
                this.service.updateLiquidatedTherapist(this.unliquidatedService[o].id, this.modelServices).subscribe((rp) => { })
              }

              this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
                this.selected = false
                this.dates = false

                if (this.administratorRole == true)
                  this.modelLiquidation.manager = ""

                this.modelLiquidation.therapist = ""
                localStorage.clear()
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.id}/liquidation-therapist`)
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
              })
            }
          })
        } else {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna forma de pago seleccionada', showConfirmButton: false, timer: 2500 })
        }
      } else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
      }
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna terapeuta seleccionada', showConfirmButton: false, timer: 2500 })
    }
  }
}