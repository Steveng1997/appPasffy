import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  manager: any

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

  modelServices: ModelService = {
    idTerapeuta: "",
    pantalla: ""
  }

  modelLiquidation: LiquidationTherapist = {
    company: "",
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
    this.serviceManager.getById(this.id).subscribe((rp) => {
      this.company = rp[0].company
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.getManager()
      } else {
        this.manager = rp
        this.administratorRole = false
        this.modelLiquidation.encargada = this.manager[0].nombre
        this.modelLiquidation.company = this.company
        this.serviceLiquidation.consultManager(this.modelLiquidation.encargada, rp[0]['company']).subscribe(async (rp) => {
          this.liquidated = rp
        })
      }
    })
  }

  getTherapist() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.serviceTherapist.getByCompany(rp[0].company).subscribe((datosTerapeuta: any) => {
        this.terapeuta = datosTerapeuta
      })
    })
  }

  bizum() {
    localStorage.setItem('Bizum', 'Bizum')

    if (localStorage.length == 1) {
      if (document.getElementById('bizum1').style.background == "") {
        document.getElementById('bizum1').style.background = '#1fb996'
        this.modelLiquidation.formaPago = 'Bizum'
      } else {
        document.getElementById('bizum1').style.background = ""
        this.modelLiquidation.formaPago = ''
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
        this.modelLiquidation.formaPago = 'Efectivo'
      } else {
        document.getElementById('cash1').style.background = ""
        this.modelLiquidation.formaPago = ''
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
        this.modelLiquidation.formaPago = 'Tarjeta'
      } else {
        document.getElementById('card1').style.background = ""
        this.modelLiquidation.formaPago = ''
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
        this.modelLiquidation.formaPago = 'Trans'
      } else {
        document.getElementById('transaction1').style.background = ""
        this.modelLiquidation.formaPago = ''
        localStorage.removeItem('Trans')
      }
    } else {
      document.getElementById('transaction1').style.background = ""
      localStorage.removeItem('Trans')
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
    }
  }

  getManager() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.modelLiquidation.company = rp[0].company
      this.serviceManager.getByCompany(rp[0].company).subscribe((datosEncargada: any) => {
        this.manager = datosEncargada
      })
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

  async inputDateAndTime() {
    console.log(this.modelLiquidation)
    this.service.getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(this.modelLiquidation.terapeuta,
      this.modelLiquidation.encargada, this.modelLiquidation.desdeHoraLiquidado, this.modelLiquidation.hastaHoraLiquidado,
      this.modelLiquidation.desdeFechaLiquidado, this.modelLiquidation.hastaFechaLiquidado, this.modelLiquidation.company).subscribe(async (rp: any) => {

        if (rp.length > 0) {
          this.unliquidatedService = rp

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

          // Filter by Pago
          const terapeuta = rp.filter(serv => serv)
          let therapistValue = terapeuta.reduce((accumulator, serv) => {
            return accumulator + serv.numberTerap
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

          this.comission(service, tip, therapistValue, drinkTherapist, drink, tobacco, vitamins, others, rp, totalCash, totalBizum, totalCard, totalTransaction)

        } else {
          this.unliquidatedService = rp
          this.ionLoaderService.dismissLoader()
          this.dates = true
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

    await this.serviceTherapist.getTerapeuta(this.modelLiquidation.terapeuta).subscribe(async (rp) => {
      this.terapeutaName = rp[0]

      // Comision
      comisiServicio = service / 100 * rp[0]?.servicio
      comiPropina = tip / 100 * rp[0]?.propina
      comiBebida = drink / 100 * rp[0]?.bebida
      comiBebidaTherapist = drinkTherapist / 100 * rp[0]?.bebidaTerap
      comiTabaco = tobacco / 100 * rp[0]?.tabaco
      comiVitamina = vitamins / 100 * rp[0]?.vitamina
      comiOtros = others / 100 * rp[0]?.otros

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
        const numbTerap = this.unliquidatedService.filter(serv => serv)
        receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)
      })

      let totalLiquidation = Math.ceil(sumCommission) - Number(receivedTherapist)
      this.modelLiquidation.importe = totalLiquidation

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

      if (this.unliquidatedService[o]?.servicio > 999)
        this.unliquidatedService[o]['servicio'] = (this.unliquidatedService[o]?.servicio / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['servicio'] = this.unliquidatedService[o]?.servicio.toString()

      if (this.unliquidatedService[o]?.propina > 999)
        this.unliquidatedService[o]['propina'] = (this.unliquidatedService[o]?.propina / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['propina'] = this.unliquidatedService[o]?.propina.toString()

      if (this.unliquidatedService[o]?.numberTerap > 999)
        this.unliquidatedService[o]['numberTerap'] = (this.unliquidatedService[o]?.numberTerap / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['numberTerap'] = this.unliquidatedService[o]?.numberTerap.toString()

      if (this.unliquidatedService[o]?.bebidas > 999)
        this.unliquidatedService[o]['bebidas'] = (this.unliquidatedService[o]?.bebidas / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['bebidas'] = this.unliquidatedService[o]?.bebidas.toString()

      if (this.unliquidatedService[o]?.tabaco > 999)
        this.unliquidatedService[o]['tabaco'] = (this.unliquidatedService[o]?.tabaco / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['tabaco'] = this.unliquidatedService[o]?.tabaco.toString()

      if (this.unliquidatedService[o]?.vitaminas > 999)
        this.unliquidatedService[o]['vitaminas'] = (this.unliquidatedService[o]?.vitaminas / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['vitaminas'] = this.unliquidatedService[o]?.vitaminas.toString()

      if (this.unliquidatedService[o]?.otros > 999)
        this.unliquidatedService[o]['otros'] = (this.unliquidatedService[o]?.otros / 1000).toFixed(3)
      else
        this.unliquidatedService[o]['otros'] = this.unliquidatedService[o]?.otros.toString()
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
      if (rp.length > 0) {
        this.modelServices.pantalla = 'new-liquiationTherapist'
        this.service.updateScreenById(rp[0]['id'], this.modelServices).subscribe(async (rp: any) => { })
        this.router.navigate([`tabs/${this.id}/edit-services/${rp[0]['id']}`])
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
    this.modelLiquidation.encargada = ""
    this.modelLiquidation.terapeuta = ""
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelServices.idTerapeuta = uuid
    this.modelLiquidation.idUnico = uuid
    this.modelLiquidation.idTerapeuta = uuid
    return this.modelLiquidation.idUnico
  }

  dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.modelLiquidation.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.modelLiquidation.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.modelLiquidation.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.modelLiquidation.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  formatDate() {
    let fromDay = '', fromMonth = '', fromYear = '', untilDay = '', untilMonth = '', untilYear = ''

    // From 

    fromDay = this.modelLiquidation.desdeFechaLiquidado.substring(8, 10)
    fromMonth = this.modelLiquidation.desdeFechaLiquidado.substring(5, 7)
    fromYear = this.modelLiquidation.desdeFechaLiquidado.substring(2, 4)

    this.modelLiquidation.desdeFechaLiquidado = `${fromDay}-${fromMonth}-${fromYear}`

    // Until

    untilDay = this.modelLiquidation.hastaFechaLiquidado.substring(8, 10)
    untilMonth = this.modelLiquidation.hastaFechaLiquidado.substring(5, 7)
    untilYear = this.modelLiquidation.hastaFechaLiquidado.substring(2, 4)

    this.modelLiquidation.hastaFechaLiquidado = `${untilDay}-${untilMonth}-${untilYear}`
  }

  save() {
    if (this.modelLiquidation.terapeuta != "") {
      if (this.modelLiquidation.encargada != "") {
        if (this.modelLiquidation.formaPago != "") {

          this.createUniqueId()
          this.modelLiquidation.currentDate = this.currentDate.toString()
          this.formatDate()
          this.dateCurrentDay()

          this.ionLoaderService.simpleLoader()

          this.serviceLiquidation.consultTherapistAndManager(this.modelLiquidation.terapeuta, this.modelLiquidation.encargada).subscribe((rp: any) => {

            if (rp.length > 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.modelLiquidation.tratamiento = this.unliquidatedService.length
                this.modelServices.liquidadoTerapeuta = true
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
              }

              this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
                this.selected = false
                this.dates = false
                this.modelLiquidation.encargada = ""
                this.modelLiquidation.terapeuta = ""
                localStorage.clear()
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.id}/liquidation-therapist`)
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
              })
            }

            else if (rp.length == 0) {

              for (let o = 0; o < this.unliquidatedService.length; o++) {
                this.modelLiquidation.tratamiento = this.unliquidatedService.length
                this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
              }

              this.serviceLiquidation.save(this.modelLiquidation).subscribe(async (rp) => {
                this.selected = false
                this.dates = false
                this.modelLiquidation.encargada = ""
                this.modelLiquidation.terapeuta = ""
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