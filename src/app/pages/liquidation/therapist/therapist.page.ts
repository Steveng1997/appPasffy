import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { LiquidationTherapist } from 'src/app/core/models/liquidationTherapist';

// Services
import { ServiceLiquidationTherapist } from 'src/app/core/services/liquidation/service-liquidation-therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
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

  // ------------------------------------------------------
  // Details
  nameTherapist: string
  sinceDate: string
  sinceTime: string
  toDate: string
  untilTime: string
  regularization: number
  payment: string

  settledData: any
  terapeutaName: any

  totalLiquidation: string

  // Suma
  totalService: string
  totalTipValue: string
  totalTherapistValue: string
  totalValueDrink: string
  totalValueDrinkTherap: string
  totalTobaccoValue: string
  totalValueVitamins: string
  totalValueOther: string

  // Comission
  serviceCommission: string
  commissionTip: string
  beverageCommission: string
  beverageTherapistCommission: string
  tobaccoCommission: string
  vitaminCommission: string
  commissionOthers: string
  sumCommission: string
  receivedTherapist: string

  // Total
  textTotalComission: string


  totalSum: string
  totalReceived: string

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
    private serviceTherapist: TherapistService,
    private services: ServiceService
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

  emptyFilter() {
    this.selectedTerapeuta = ""
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

  goManager() {
    this.router.navigate([`tabs/${this.id}/liquidation-manager`])
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

        this.regularization = rp[0]['valueRegularizacion']

        if (rp[0]['valueRegularizacion'] > 999) {

          const coma = rp[0]['valueRegularizacion'].toString().indexOf(".") !== -1 ? true : false;
          const array = coma ? rp[0]['valueRegularizacion'].toString().split(".") : rp[0]['valueRegularizacion'].toString().split("");
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
          this.regularization = integer[0]
        } else {
          this.regularization = rp[0]['valueRegularizacion'].toString()
        }

        await this.sumTotal(id)

        this.details = true
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

        this.comission(service, tip, therapistValue, drinkTherapist, drink, tobacco, vitamins, others, rp)
      } else {
        await this.serviceLiquidation.consultTherapistId(id).subscribe(async (rp: any) => {
          // this.convertToZeroEdit()
          // this.loading = false
          // this.liquidationForm = false
          // this.editTerap = true
        })
      }
    })
  }

  async comission(service: number, tip: number, therapistValue: number, drinkTherapist: number, drink: number, tobacco: number, vitamins: number, others: number, element) {
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
      let serviceCommission = Number(comisiServicio.toFixed(1))
      let commissionTip = Number(comiPropina.toFixed(1))
      let beverageCommission = Number(comiBebida.toFixed(1))
      let beverageTherapistCommission = Number(comiBebidaTherapist.toFixed(1))
      let tobaccoCommission = Number(comiTabaco.toFixed(1))
      let vitaminCommission = Number(comiVitamina.toFixed(1))
      let commissionOthers = Number(comiOtros.toFixed(1))

      sumComision = Number(serviceCommission) + Number(commissionTip) + Number(beverageCommission) + Number(beverageTherapistCommission) + Number(tobaccoCommission) + Number(vitaminCommission) + Number(commissionOthers)

      if (sumComision != 0 || sumComision != undefined) {
        sumCommission = Number(sumComision.toFixed(1))
      }

      // Recibido
      element.map(item => {
        const numbTerap = this.settledData.filter(serv => serv)
        this.receivedTherapist = numbTerap.reduce((accumulator, serv) => {
          return accumulator + serv.numberTerap
        }, 0)
      })

      debugger
      let totalLiquidation = sumCommission - Number(receivedTherapist) + Number(this.regularization)
      totalCommission = sumCommission - Number(receivedTherapist)

      // this.validateNullData()
      await this.thousandPointEdit(totalLiquidation, service, serviceCommission, tip, commissionTip, drink, drinkTherapist, beverageCommission, beverageTherapistCommission, tobacco,
        tobaccoCommission, vitamins, vitaminCommission, others, sumCommission, commissionOthers, receivedTherapist)

      if (rp.length == 0) this.textTotalComission = '0'
      // this.loading = false
      // this.liquidationForm = false
      // this.editTerap = true
    })
  }

  async thousandPointEdit(totalLiquidation: number, service: number, serviceCommission: number, tip: number, tipCommission: number, drink: number, drinkTherap: number, beverageCommission: number,
    beverageTherapistCommission: number, tobacco: number, tobaccoCommission: number, vitamins: number, vitaminCommission: number, others: number, commissionOthers: number, sumCommission: number,
    receivedTherapist: number) {

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

    if (serviceCommission > 999) {

      const coma = serviceCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? serviceCommission.toString().split(".") : serviceCommission.toString().split("");
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
      this.serviceCommission = integer[0].toString()
    } else {
      this.serviceCommission = serviceCommission.toString()
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

    if (tipCommission > 999) {

      const coma = tipCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? tipCommission.toString().split(".") : tipCommission.toString().split("");
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
      this.commissionTip = integer[0].toString()
    } else {
      this.commissionTip = tipCommission.toString()
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

    if (beverageCommission > 999) {

      const coma = beverageCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? beverageCommission.toString().split(".") : beverageCommission.toString().split("");
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
      this.beverageCommission = integer[0].toString()
    } else {
      this.beverageCommission = beverageCommission.toString()
    }

    if (beverageTherapistCommission > 999) {

      const coma = beverageTherapistCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? beverageTherapistCommission.toString().split(".") : beverageTherapistCommission.toString().split("");
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
      this.beverageTherapistCommission = integer[0].toString()
    } else {
      this.beverageTherapistCommission = beverageTherapistCommission.toString()
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

    if (tobaccoCommission > 999) {

      const coma = tobaccoCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? tobaccoCommission.toString().split(".") : tobaccoCommission.toString().split("");
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
      this.tobaccoCommission = integer[0].toString()
    } else {
      this.tobaccoCommission = tobaccoCommission.toString()
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

    if (vitaminCommission > 999) {

      const coma = vitaminCommission.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? vitaminCommission.toString().split(".") : vitaminCommission.toString().split("");
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
      this.vitaminCommission = integer[0].toString()
    } else {
      this.vitaminCommission = vitaminCommission.toString()
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

    if (commissionOthers > 999) {

      const coma = commissionOthers.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? commissionOthers.toString().split(".") : commissionOthers.toString().split("");
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
      this.commissionOthers = integer[0].toString()
    } else {
      this.commissionOthers = commissionOthers.toString()
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

    if (receivedTherapist > 999) {

      const coma = receivedTherapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? receivedTherapist.toString().split(".") : receivedTherapist.toString().split("");
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
      this.totalReceived = receivedTherapist.toString()
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
  }
}