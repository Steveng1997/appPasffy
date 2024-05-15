import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import moment from 'moment'

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
  manager: any
  receivedManager: any

  id: number
  liquidated: any

  // Tables
  terapeutaName: any

  totalLiquidation: string

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

  currentDate = new Date().getTime()

  fijoDia: number
  fixedTotalDay: number
  letterFixedDay = ""

  modelServices: ModelService = {
    idEncargada: ""
  }

  modelLiquidation: LiquidationManager = {
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
    regularizacion: "",
    tratamiento: 0,
    valueRegularizacion: 0
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
    this.serviceManager.getById(this.id).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.administratorRole = true
        this.GetAllManagers()
      } else {
        this.manager = rp
        this.administratorRole = false
        this.modelLiquidation.encargada = this.manager[0].nombre
        this.serviceLiquidation.getByEncargada(this.modelLiquidation.encargada).subscribe(async (rp) => {
          this.liquidated = rp
        })
      }
    })
  }

  GetAllManagers() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  async getThoseThatNotLiquidated() {
    this.service.getByLiquidManagerFalse().subscribe(async (datoServicio) => {
      this.unliquidatedService = datoServicio
    })
  }

  async dateExists() {
    let fromMonth = '', fromDay = '', fromYear = '', convertMonth = '', convertDay = '',
      untilMonth = 0, untilDay = 0, untilYear = 0, currentDate = new Date()

    await this.serviceLiquidation.getByEncargada(this.modelLiquidation.encargada).subscribe(async (rp: any) => {
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

    await this.service.getEncargadaFechaAsc(this.modelLiquidation.encargada).subscribe(async (rp) => {
      año = rp[0]['fechaHoyInicio'].substring(0, 4)
      mes = rp[0]['fechaHoyInicio'].substring(5, 7)
      dia = rp[0]['fechaHoyInicio'].substring(8, 10)
      this.modelLiquidation.desdeFechaLiquidado = `${año}-${mes}-${dia}`
      this.modelLiquidation.desdeHoraLiquidado = rp[0]['horaStart']
      await this.inputDateAndTime()
    })
  }

  calculateServices() {
    if (this.modelLiquidation.encargada != "") {
      this.getThoseThatNotLiquidated()
      this.ionLoaderService.simpleLoader()

      this.service.getByEncargada(this.modelLiquidation.encargada).subscribe(async (resp: any) => {
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
    this.service.getByEncargadaFechaHoraInicioFechaHoraFin(this.modelLiquidation.encargada, this.modelLiquidation.desdeHoraLiquidado,
      this.modelLiquidation.hastaHoraLiquidado, this.modelLiquidation.desdeFechaLiquidado, this.modelLiquidation.hastaFechaLiquidado).subscribe(async (rp: any) => {

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
          this.unliquidatedService = rp
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

    await this.serviceManager.getEncargada(this.modelLiquidation.encargada).subscribe(async (rp) => {
      this.terapeutaName = rp[0]
      this.fijoDia = rp[0]['fijoDia']
      this.letterFixedDay = this.fijoDia.toString()

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
        this.sumCommission2 = Math.ceil(sumComision)
        sumCommission = Number(sumComision.toFixed(1))
      }

      element.map(item => {
        const numbTerap = this.unliquidatedService.filter(serv => serv)
        receivedManager = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberEncarg
        }, 0)
      })

      this.calculateTheDays()
      this.fixedTotalDay = this.fixedDay * this.fijoDia
      this.pountFixedDay()

      this.receivedManager = receivedManager

      let totalLiquidation = Math.ceil(sumCommission) + this.fixedTotalDay - Number(receivedManager)
      this.modelLiquidation.importe = totalLiquidation

      let sumTherapist = totalCash + totalBizum + totalCard + totalTransaction

      this.validateNullData()
      this.ionLoaderService.dismissLoader()

      await this.thousandPoint(totalLiquidation, service, totalTreatment, tip, totalTip, drink, drinkTherapist, totalDrink, totalDrinkTherap, tobacco,
        totalTobacco, vitamins, totalVitamin, others, totalOther, sumCommission, receivedManager, totalCash, totalBizum, totalCard, totalTransaction, sumTherapist)

      this.dates = true
      this.selected = true
      document.getElementById('nuevaLiquidation').style.overflowY = 'auto'
      document.getElementById('overviewDates').style.height = '270px'
    })
  }

  calculateTheDays() {
    let day = '', convertDay = '', month = '', year = '', hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

    dayEnd = this.modelLiquidation.desdeFechaLiquidado.substring(8, 10)
    monthEnd = this.modelLiquidation.desdeFechaLiquidado.substring(5, 7)
    yearEnd = this.modelLiquidation.desdeFechaLiquidado.substring(0, 4)

    var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd}`, "YYYY-MM-DD")

    // Date 2

    day = this.modelLiquidation.hastaFechaLiquidado.substring(8, 10)
    month = this.modelLiquidation.hastaFechaLiquidado.substring(5, 7)
    year = this.modelLiquidation.hastaFechaLiquidado.substring(0, 4)

    var date2 = moment(`${year}-${month}-${day}`, "YYYY-MM-DD")

    // this.fixedDay = date1.diff(date2, 'd')
    this.fixedDay = date2.diff(date1, 'days')
  }

  validateNullData() {

  }

  async thousandPoint(totalLiquidation: number, service: number, totalTreatment: number, tip: number, totalTip: number, drink: number, drinkTherap: number, totalDrink: number,
    totalDrinkTherap: number, tobacco: number, totalTobacco: number, vitamins: number, totalVitamin: number, others: number, totalOther: number, sumCommission: number,
    receivedManager: number, totalCash: number, totalBizum: number, totalCard: number, totalTransaction: number, sumTherapist: number) {

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

    for (let o = 0; o < this.unliquidatedService?.length; o++) {
      if (this.unliquidatedService[o]?.servicio > 999) {

        const coma = this.unliquidatedService[o]?.servicio.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.servicio.toString().split(".") : this.unliquidatedService[o]?.servicio.toString().split("");
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
        this.unliquidatedService[o]['servicio'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['servicio'] = this.unliquidatedService[o]?.servicio
      }

      if (this.unliquidatedService[o]?.propina > 999) {

        const coma = this.unliquidatedService[o]?.propina.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.propina.toString().split(".") : this.unliquidatedService[o]?.propina.toString().split("");
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
        this.unliquidatedService[o]['propina'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['propina'] = this.unliquidatedService[o]?.propina
      }

      if (this.unliquidatedService[o]?.numberTerap > 999) {

        const coma = this.unliquidatedService[o]?.numberTerap.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.numberTerap.toString().split(".") : this.unliquidatedService[o]?.numberTerap.toString().split("");
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
        this.unliquidatedService[o]['numberTerap'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['numberTerap'] = this.unliquidatedService[o]?.numberTerap
      }

      if (this.unliquidatedService[o]?.bebidas > 999) {

        const coma = this.unliquidatedService[o]?.bebidas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.bebidas.toString().split(".") : this.unliquidatedService[o]?.bebidas.toString().split("");
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
        this.unliquidatedService[o]['bebidas'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['bebidas'] = this.unliquidatedService[o]?.bebidas
      }

      if (this.unliquidatedService[o]?.tabaco > 999) {

        const coma = this.unliquidatedService[o]?.tabaco.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.tabaco.toString().split(".") : this.unliquidatedService[o]?.tabaco.toString().split("");
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
        this.unliquidatedService[o]['tabaco'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['tabaco'] = this.unliquidatedService[o]?.tabaco
      }

      if (this.unliquidatedService[o]?.vitaminas > 999) {

        const coma = this.unliquidatedService[o]?.vitaminas.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.vitaminas.toString().split(".") : this.unliquidatedService[o]?.vitaminas.toString().split("");
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
        this.unliquidatedService[o]['vitaminas'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['vitaminas'] = this.unliquidatedService[o]?.vitaminas
      }

      if (this.unliquidatedService[o]?.otros > 999) {

        const coma = this.unliquidatedService[o]?.otros.toString().indexOf(".") !== -1 ? true : false;
        const array = coma ? this.unliquidatedService[o]?.otros.toString().split(".") : this.unliquidatedService[o]?.otros.toString().split("");
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
        this.unliquidatedService[o]['otros'] = integer[0].toString()
      } else {
        this.unliquidatedService[o]['otros'] = this.unliquidatedService[o]?.otros
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

    if (this.fixedTotalDay > 999) {

      const coma = this.fixedTotalDay.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.fixedTotalDay.toString().split(".") : this.fixedTotalDay.toString().split("");
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
      this.totalFixedDay = this.fixedTotalDay.toString()
    }
  }

  regularization(event: any) {
    let numberRegularization = 0, valueRegularization = 0
    numberRegularization = Number(event.target.value)

    if (numberRegularization > 0) {
      valueRegularization = Number(this.totalLiquidation) + numberRegularization
    } else {
      valueRegularization = Number(this.totalLiquidation) + numberRegularization
    }

    this.modelLiquidation.valueRegularizacion = numberRegularization;

    if (valueRegularization > 999 || numberRegularization > 999) {

      const coma = valueRegularization.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? valueRegularization.toString().split(".") : valueRegularization.toString().split("");
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
      this.totalLiquidation = integer.toString()
    } else {
      this.totalLiquidation = valueRegularization.toString()
      // this.valueRegular = numberRegularization.toString()
    }
  }

  edit(id: number) {
    this.router.navigate([`tabs/${this.id}/edit-services/${id}`])
  }

  notes() {

  }

  fixedNumberDay(event: any) {
    let numberValue = 0
    numberValue = Number(event.target.value)
    this.modelLiquidation.fixedDay = Number(event.target.value)

    if (numberValue > 0) {
      this.serviceManager.getEncargada(this.modelLiquidation.encargada).subscribe((resp: any) => {
        this.fijoDia = resp[0]['fijoDia']
        this.letterFixedDay = this.fijoDia.toString()
        this.fixedTotalDay = numberValue * this.fijoDia
        this.pountFixedDay()
        let totalCommission = this.sumCommission2 + this.fixedTotalDay - this.receivedManager
        this.modelLiquidation.importe = totalCommission

        if (totalCommission > 999) {

          const coma = totalCommission.toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? totalCommission.toString().split(".") : totalCommission.toString().split("");
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
          this.totalLiquidation = totalCommission.toString()
        }
      })
    }
  }

  pountFixedDay() {
    if (this.fixedTotalDay > 999) {

      const coma = this.fixedTotalDay.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.fixedTotalDay.toString().split(".") : this.fixedTotalDay.toString().split("");
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
      this.totalFixedDay = this.fixedTotalDay.toString()
    }
  }

  back() {
    document.getElementById('nuevaLiquidation').style.overflowY = 'hidden'
    document.getElementById('overviewDates').style.height = '109px'
    this.dates = false
    this.selected = false
    this.modelLiquidation.encargada = ""
    this.router.navigate([`tabs/${this.id}/liquidation-manager`])
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelServices.idEncargada = uuid
    this.modelLiquidation.idUnico = uuid
    this.modelLiquidation.idEncargada = uuid
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
    if (this.modelLiquidation.encargada != "") {

      this.createUniqueId()
      this.modelLiquidation.currentDate = this.currentDate.toString()
      this.formatDate()
      this.dateCurrentDay()

      if (this.modelLiquidation.fixedDay == 0)
        this.modelLiquidation.fixedDay = this.fixedDay

      this.ionLoaderService.simpleLoader()

      if (this.modelLiquidation.regularizacion != "") {
        this.modelLiquidation.regularizacion = this.modelLiquidation.regularizacion.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      }

      this.serviceLiquidation.getByEncargada(this.modelLiquidation.encargada).subscribe((rp: any) => {

        if (rp.length > 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.modelLiquidation.tratamiento = this.unliquidatedService.length
            this.modelServices.liquidadoEncargada = true
            this.service.updateLiquidacionEncarg(this.unliquidatedService[o]['id'], this.modelServices).subscribe((rp) => { })
          }

          this.serviceLiquidation.settlementRecord(this.modelLiquidation).subscribe(async (rp) => {
            this.selected = false
            this.dates = false
            this.modelLiquidation.encargada = ""
            this.ionLoaderService.dismissLoader()
            location.replace(`tabs/${this.id}/liquidation-manager`)
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
          })
        }

        else if (rp.length == 0) {

          for (let o = 0; o < this.unliquidatedService.length; o++) {
            this.modelLiquidation.tratamiento = this.unliquidatedService.length
            this.service.updateLiquidacionTerap(this.unliquidatedService[o]['id'], this.modelLiquidation).subscribe((rp) => { })
          }

          this.serviceLiquidation.settlementRecord(this.modelLiquidation).subscribe(async (rp) => {
            this.selected = false
            this.dates = false
            this.modelLiquidation.encargada = ""
          })

          this.ionLoaderService.dismissLoader()
          location.replace(`tabs/${this.id}/liquidation-therapist`)
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: 'Liquidado Correctamente!', showConfirmButton: false, timer: 2500 })
        }
      })
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
    }
  }
}