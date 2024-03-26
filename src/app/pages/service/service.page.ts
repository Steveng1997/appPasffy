import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Excel
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

// Services
import { ServiceService } from 'src/app/core/services/service/service.service';
import { ModelService } from 'src/app/core/models/service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit {

  details: boolean = false
  textSearch: boolean = false
  filter: boolean = false
  filterSearch: string

  idService: any

  deleteButton: boolean = false

  fechaInicio: string
  fechaFinal: string
  horaInicio: string
  horaFinal: string
  filtredBusqueda: string
  page!: number

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

  dateStart: string
  dateEnd: string
  horaStart: string
  horaEnd: string
  parmHourStart: string
  parmHourEnd: string
  selectedDateStart: string
  selectedDateEnd: string

  servicio: any
  horario: any

  idUser: number
  administratorRole: boolean = false

  // Servicios
  totalServicio: number
  totalPiso2: number;
  totalPiso: number
  totalValorTerapeuta: number
  totalValorEncargada: number
  totalValorAOtros: number
  TotalValorBebida: number
  totalValueDrinkTherapist: number
  TotalValorTabaco: number
  totalValorVitaminas: number
  totalValorPropina: number
  totalValorOtroServ: number
  totalValueTaxi: number
  totalValor: number

  // Services String
  TotalValueLetter: string
  TotalServiceLetter: string
  TotalFloor1Letter: string
  TotalFloor2Letter: string
  TotalTherapistLetter: string
  TotalManagerLetter: string
  TotalToAnotherLetter: string
  TotalDrinkLetter: string
  totalDrinkTherapistLetter: string
  TotalTobaccoLetter: string
  TotalVitaminsLetter: string
  TotalTipLetter: string
  TotalOthersLetter: string
  TotalTaxiLetter: string

  // Excel
  private _workbook!: Workbook;

  serviceModel: ModelService = {
    pantalla: ""
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private serviceService: ServiceService,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService
  ) { }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(params['id'])

    if (this.idUser) {
      await this.serviceManager.getById(this.idUser).subscribe((rp) => {
        if (rp[0]['rol'] == 'administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.manager = rp
          this.selectedEncargada = this.manager[0].nombre
        }
      })
    }

    await this.getTherapist()
    this.getServices()
    this.emptyTotals()
    // this.details = false
  }

  emptyTotals() {
    if (this.totalServicio == undefined) this.totalServicio = 0
    if (this.totalPiso == undefined) this.totalPiso = 0
    if (this.totalPiso2 == undefined) this.totalPiso2 = 0
    if (this.totalValorTerapeuta == undefined) this.totalValorTerapeuta = 0
    if (this.totalValorEncargada == undefined) this.totalValorEncargada = 0
    if (this.totalValorAOtros == undefined) this.totalValorAOtros = 0
    if (this.TotalValorBebida == undefined) this.TotalValorBebida = 0
    if (this.totalValueDrinkTherapist == undefined) this.totalValueDrinkTherapist = 0
    if (this.TotalValorTabaco == undefined) this.TotalValorTabaco = 0
    if (this.totalValorVitaminas == undefined) this.totalValorVitaminas = 0
    if (this.totalValorPropina == undefined) this.totalValorPropina = 0
    if (this.totalValorOtroServ == undefined) this.totalValorOtroServ = 0
    if (this.totalValueTaxi == undefined) this.totalValueTaxi = 0
    if (this.totalValor == undefined) this.totalValor = 0
  }

  todaysDdate() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = '', currentDate

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      currentDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      currentDate = `${year}-${convertMonth}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      currentDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      currentDate = `${year}-${convertMonth}-${day}`
    }

    this.dateStart = currentDate
    this.dateEnd = currentDate
  }

  getServices = async () => {
    let service
    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.serviceService.getServicio().subscribe((rp: any) => {
          this.servicio = rp
          service = rp

          if (rp.length != 0) {
            this.totalSumOfServices(service)
          }
          return service
        })
      } else {
        this.serviceService.getByManagerOrder(rp[0]['nombre']).subscribe((rp: any) => {
          this.servicio = rp
          service = rp
          if (rp.length != 0) {
            this.totalSumOfServices(service)
          }
          return service
        })
      }
    })
  }

  pointThousandTable(i: number) {
    if (this.servicio[i].numberPiso1 > 0) {

      const coma = this.servicio[i].numberPiso1.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberPiso1.toString().split(".") : this.servicio[i].numberPiso1.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].numberPiso1 = integer[0].toString()
    } else {
      this.servicio[i].numberPiso1 = this.totalValor
    }

    if (this.servicio[i].numberPiso2 > 0) {

      const coma = this.servicio[i].numberPiso2.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberPiso2.toString().split(".") : this.servicio[i].numberPiso2.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].numberPiso2 = integer[0].toString()
    } else {
      this.servicio[i].numberPiso2 = this.servicio[i].numberPiso2
    }

    if (this.servicio[i].numberTerap > 0) {

      const coma = this.servicio[i].numberTerap.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberTerap.toString().split(".") : this.servicio[i].numberTerap.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].numberTerap = integer[0].toString()
    } else {
      this.servicio[i].numberTerap = this.servicio[i].numberTerap
    }

    if (this.servicio[i].numberEncarg > 0) {

      const coma = this.servicio[i].numberEncarg.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberEncarg.toString().split(".") : this.servicio[i].numberEncarg.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].numberEncarg = integer[0].toString()
    } else {
      this.servicio[i].numberEncarg = this.servicio[i].numberEncarg
    }

    if (this.servicio[i].numberTaxi > 0) {

      const coma = this.servicio[i].numberTaxi.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].numberTaxi.toString().split(".") : this.servicio[i].numberTaxi.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].numberTaxi = integer[0].toString()
    } else {
      this.servicio[i].numberTaxi = this.servicio[i].numberTaxi
    }

    if (this.servicio[i].bebidas > 0) {

      const coma = this.servicio[i].bebidas.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].bebidas.toString().split(".") : this.servicio[i].bebidas.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].bebidas = integer[0].toString()
    } else {
      this.servicio[i].bebidas = this.servicio[i].bebidas
    }

    if (this.servicio[i].tabaco > 0) {

      const coma = this.servicio[i].tabaco.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].tabaco.toString().split(".") : this.servicio[i].tabaco.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].tabaco = integer[0].toString()
    } else {
      this.servicio[i].tabaco = this.servicio[i].tabaco.toString()
    }

    if (this.servicio[i].vitaminas > 0) {

      const coma = this.servicio[i].vitaminas.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].vitaminas.toString().split(".") : this.servicio[i].vitaminas.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].vitaminas = integer[0].toString()
    } else {
      this.servicio[i].vitaminas = this.servicio[i].vitaminas
    }

    if (this.servicio[i].propina > 0) {

      const coma = this.servicio[i].propina.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].propina.toString().split(".") : this.servicio[i].propina.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].propina = integer[0].toString()
    } else {
      this.servicio[i].propina = this.servicio[i].propina
    }

    if (this.servicio[i].otros > 0) {

      const coma = this.servicio[i].otros.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].otros.toString().split(".") : this.servicio[i].otros.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].otros = integer[0].toString()
    } else {
      this.servicio[i].otros = this.servicio[i].otros
    }

    if (this.servicio[i].totalServicio > 0) {

      const coma = this.servicio[i].totalServicio.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].totalServicio.toString().split(".") : this.servicio[i].totalServicio.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].totalServicio = integer[0].toString()
    } else {
      this.servicio[i].totalServicio = this.servicio[i].totalServicio
    }

    if (this.servicio[i].servicio > 0) {

      const coma = this.servicio[i].servicio.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.servicio[i].servicio.toString().split(".") : this.servicio[i].servicio.toString().split("");
      let integer = coma ? array[i].split("") : array;
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
      this.servicio[i].servicio = integer[0].toString()
    } else {
      this.servicio[i].servicio = this.servicio[i].servicio.toString()
    }
  }

  async OK() {
    this.filter = false

    await this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.selectedTerapeuta != "" || this.selectedEncargada != "" ||
          this.selectedDateStart || this.selectedDateEnd != "") {
          this.deleteButton = true
        } else {
          this.deleteButton = false
        }
      } else {
        this.deleteButton = false
      }
    })
  }

  filters = async () => {

    this.filtredBusqueda = this.filtredBusqueda.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

    // if (this.formTemplate.value.fechaInicio != "") {
    //   let fecha = ''
    //   fecha = this.formTemplate.value.fechaInicio
    //   this.fechaInicio = fecha
    // }

    // if (this.formTemplate.value.FechaFin != "") {
    //   let fechaFin = ''
    //   fechaFin = this.formTemplate.value.FechaFin
    //   this.fechaFinal = fechaFin
    // }

    // if (this.formTemplate.value.horaStart != "") {
    //   let horaStart = ''
    //   horaStart = this.formTemplate.value.horaStart
    //   this.horaInicio = horaStart
    // }

    // if (this.formTemplate.value.horaEnd != "") {
    //   let horaEnd = ''
    //   horaEnd = this.formTemplate.value.horaEnd
    //   this.horaFinal = horaEnd
    // }

    await this.calculateSumOfServices()
  }

  PaymentForm() {
    // this.serviceService.getPaymentForm(this.formTemplate.value.formaPago).subscribe((rp) => {
    //   this.servicio = rp
    // })
  }

  calculateSumOfServices = async () => {

    const therapistCondition = serv => {
      return (this.selectedTerapeuta) ? serv.terapeuta === this.selectedTerapeuta : true
    }

    const managerCondition = serv => {
      return (this.selectedEncargada) ? serv.encargada === this.selectedEncargada : true
    }

    const conditionBetweenDates = serv => {
      if (this.fechaInicio === undefined && this.fechaFinal === undefined) return true
      if (this.fechaInicio === undefined && serv.fechaHoyInicio <= this.fechaFinal) return true
      if (this.fechaFinal === undefined && serv.fechaHoyInicio === this.fechaInicio) return true
      if (serv.fechaHoyInicio >= this.fechaInicio && serv.fechaHoyInicio <= this.fechaFinal) return true

      return false
    }

    this.parmHourStart = `${this.fechaInicio} ${this.horaInicio}`
    this.parmHourEnd = `${this.fechaFinal} ${this.horaFinal}`

    const conditionBetweenHours = serv => {
      if (this.horaInicio === undefined && this.horaStart === undefined) return true
      if (this.horaInicio === undefined && serv.horaFinal <= this.horaFinal) return true
      if (this.horaFinal === undefined && serv.horaInicio === this.horaInicio) return true
      if (`${serv.fechaHoyInicio} ${serv.horaStart}` >= this.parmHourStart && `${serv.fechaHoyInicio} ${serv.horaEnd}` <= this.parmHourEnd) return true
      // if (serv.horaStart >= this.horaInicio && serv.horaEnd <= this.horaFinal) return true

      return false
    }

    const searchCondition = serv => {
      if (!this.filtredBusqueda) return true
      const criterio = this.filtredBusqueda
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }

    const wayToPay = serv => {
      return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true
    }

    // Filter by Servicio
    if (Array.isArray(this.servicio)) {

      const servicios = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalServicio = servicios.reduce((accumulator, serv) => {
        return accumulator + serv.servicio
      }, 0)


      // Filter by Pisos
      const pisoss = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalPiso = pisoss.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso1
      }, 0)

      // Filter by Pisos
      const pisos2 = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalPiso2 = pisos2.reduce((accumulator, serv) => {
        return accumulator + serv.numberPiso2
      }, 0)

      // Filter by Terapeuta
      const terapeuta = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorTerapeuta = terapeuta.reduce((accumulator, serv) => {
        return accumulator + serv.numberTerap
      }, 0)

      // Filter by Encargada
      const encargada = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorEncargada = encargada.reduce((accumulator, serv) => {
        return accumulator + serv.numberEncarg
      }, 0)

      // Filter by Valor Otro
      const valorOtro = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorAOtros = valorOtro.reduce((accumulator, serv) => {
        return accumulator + serv.numberTaxi
      }, 0)

      // Filter by Valor Bebida
      const valorBebida = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.TotalValorBebida = valorBebida.reduce((accumulator, serv) => {
        return accumulator + serv.bebidas
      }, 0)

      // Filter by Valor Bebida
      const valueDrinkTherapist = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValueDrinkTherapist = valueDrinkTherapist.reduce((accumulator, serv) => {
        return accumulator + serv.bebidaTerap
      }, 0)

      // Filter by Valor Tabaco
      const valorTabaco = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.TotalValorTabaco = valorTabaco.reduce((accumulator, serv) => {
        return accumulator + serv.tabaco
      }, 0)

      // Filter by Valor Vitamina
      const valorVitamina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorVitaminas = valorVitamina.reduce((accumulator, serv) => {
        return accumulator + serv.vitaminas
      }, 0)

      // Filter by Valor Propina
      const valorPropina = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorPropina = valorPropina.reduce((accumulator, serv) => {
        return accumulator + serv.propina
      }, 0)

      // Filter by Valor Total
      const valorTotal = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValor = valorTotal.reduce((accumulator, serv) => {
        this.idService = valorTotal
        return accumulator + serv.totalServicio
      }, 0)

      // Filter by Valor Propina
      const valorOtros = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValorOtroServ = valorOtros.reduce((accumulator, serv) => {
        return accumulator + serv.otros
      }, 0)

      // Filter by Valor Total
      const valueTaxi = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && searchCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && wayToPay(serv))
      this.totalValueTaxi = valueTaxi.reduce((accumulator, serv) => {
        return accumulator + serv.taxi
      }, 0)
    }

    this.thousandPoint()
  }

  thousandPoint() {

    if (this.totalValor > 999) {
      const coma = this.totalValor.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValor.toString().split(".") : this.totalValor.toString().split("");
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
      this.TotalValueLetter = integer[0].toString()
    } else {
      this.TotalValueLetter = this.totalValor.toString()
    }

    if (this.totalServicio > 999) {
      const coma = this.totalServicio.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalServicio.toString().split(".") : this.totalServicio.toString().split("");
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
      this.TotalServiceLetter = integer[0].toString()
    } else {
      this.TotalServiceLetter = this.totalServicio.toString()
    }

    if (this.totalPiso > 999) {
      const coma = this.totalPiso.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPiso.toString().split(".") : this.totalPiso.toString().split("");
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
      this.TotalFloor1Letter = integer[0].toString()
    } else {
      this.TotalFloor1Letter = this.totalPiso.toString()
    }

    if (this.totalPiso2 > 999) {
      const coma = this.totalPiso2.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalPiso2.toString().split(".") : this.totalPiso2.toString().split("");
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
      this.TotalFloor2Letter = integer[0].toString()
    } else {
      this.TotalFloor2Letter = this.totalPiso2.toString()
    }

    if (this.totalValorTerapeuta > 999) {
      const coma = this.totalValorTerapeuta.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorTerapeuta.toString().split(".") : this.totalValorTerapeuta.toString().split("");
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
      this.TotalTherapistLetter = integer[0].toString()
    } else {
      this.TotalTherapistLetter = this.totalValorTerapeuta.toString()
    }

    if (this.totalValorEncargada > 999) {
      const coma = this.totalValorEncargada.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorEncargada.toString().split(".") : this.totalValorEncargada.toString().split("");
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
      this.TotalManagerLetter = integer[0].toString()
    } else {
      this.TotalManagerLetter = this.totalValorEncargada.toString()
    }

    if (this.totalValorAOtros > 999) {
      const coma = this.totalValorAOtros.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorAOtros.toString().split(".") : this.totalValorAOtros.toString().split("");
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
      this.TotalToAnotherLetter = integer[0].toString()
    } else {
      this.TotalToAnotherLetter = this.totalValorAOtros.toString()
    }

    if (this.TotalValorBebida > 999) {
      const coma = this.TotalValorBebida.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.TotalValorBebida.toString().split(".") : this.TotalValorBebida.toString().split("");
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
      this.TotalDrinkLetter = integer[0].toString()
    } else {
      this.TotalDrinkLetter = this.TotalValorBebida.toString()
    }

    if (this.totalValueDrinkTherapist > 999) {
      const coma = this.totalValueDrinkTherapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueDrinkTherapist.toString().split(".") : this.totalValueDrinkTherapist.toString().split("");
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
      this.totalDrinkTherapistLetter = integer[0].toString()
    } else {
      this.totalDrinkTherapistLetter = this.totalValueDrinkTherapist.toString()
    }

    if (this.TotalValorTabaco > 999) {
      const coma = this.TotalValorTabaco.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.TotalValorTabaco.toString().split(".") : this.TotalValorTabaco.toString().split("");
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
      this.TotalTobaccoLetter = integer[0].toString()
    } else {
      this.TotalTobaccoLetter = this.TotalValorTabaco.toString()
    }

    if (this.totalValorVitaminas > 999) {
      const coma = this.totalValorVitaminas.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorVitaminas.toString().split(".") : this.totalValorVitaminas.toString().split("");
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
      this.TotalVitaminsLetter = integer[0].toString()
    } else {
      this.TotalVitaminsLetter = this.totalValorVitaminas.toString()
    }

    if (this.totalValorPropina > 999) {
      const coma = this.totalValorPropina.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorPropina.toString().split(".") : this.totalValorPropina.toString().split("");
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
      this.TotalTipLetter = integer[0].toString()
    } else {
      this.TotalTipLetter = this.totalValorPropina.toString()
    }

    if (this.totalValorOtroServ > 999) {
      const coma = this.totalValorOtroServ.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValorOtroServ.toString().split(".") : this.totalValorOtroServ.toString().split("");
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
      this.TotalOthersLetter = integer[0].toString()
    } else {
      this.TotalOthersLetter = this.totalValorOtroServ.toString()
    }

    if (this.totalValueTaxi > 999) {
      const coma = this.totalValueTaxi.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? this.totalValueTaxi.toString().split(".") : this.totalValueTaxi.toString().split("");
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
      this.TotalTaxiLetter = integer[0].toString()
    } else {
      this.TotalTaxiLetter = this.totalValueTaxi.toString()
    }

    this.ionLoaderService.dismissLoader()
  }

  totalSumOfServices(element) {
    const totalServ = element.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.idService = element
    this.totalServicio = totalServ

    const totalPisos = element.map(({ numberPiso1 }) => numberPiso1).reduce((acc, value) => acc + value, 0)
    this.totalPiso = totalPisos

    const totalPisos2 = element.map(({ numberPiso2 }) => numberPiso2).reduce((acc, value) => acc + value, 0)
    this.totalPiso2 = totalPisos2

    const totalTera = element.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalValorTerapeuta = totalTera

    const totalEncarg = element.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalValorEncargada = totalEncarg

    const totalOtr = element.map(({ numberTaxi }) => numberTaxi).reduce((acc, value) => acc + value, 0)
    this.totalValorAOtros = totalOtr

    const totalValorBebida = element.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.TotalValorBebida = totalValorBebida

    const totalValueDrinkTherapist = element.map(({ bebidaTerap }) => bebidaTerap).reduce((acc, value) => acc + value, 0)
    this.totalValueDrinkTherapist = totalValueDrinkTherapist

    const totalValorTab = element.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.TotalValorTabaco = totalValorTab

    const totalValorVitamina = element.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalValorVitaminas = totalValorVitamina

    const totalValorProp = element.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalValorPropina = totalValorProp

    const totalValorOtroServicio = element.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalValorOtroServ = totalValorOtroServicio

    const totalValueTaxi = element.map(({ taxi }) => taxi).reduce((acc, value) => acc + value, 0)
    this.totalValueTaxi = totalValueTaxi

    const totalvalors = element.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
    this.totalValor = totalvalors

    this.thousandPoint()
  }

  getTherapist = async () => {
    let therapit
    this.serviceTherapist.getAllTerapeuta().subscribe((rp) => {
      this.terapeuta = rp
      therapit = rp

      return therapit
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada) => {
      this.manager = datosEncargada
    })
  }

  notes(targetModal, modal) {
    var notaMensaje = []
    this.serviceService.getById(targetModal).subscribe((rp) => {
      notaMensaje = rp[0]

      // if (notaMensaje['nota'] != '')
      //   this.modalService.open(modal, {
      //     centered: true,
      //     backdrop: 'static',
      //   })
    })
  }

  arrowLeft() {
    document.querySelector('.column').scrollLeft += 30;
    document.getElementById('arrowLeft').style.display = 'none'
  }

  editForm(id: number) {
    this.serviceModel.pantalla = 'tabla'
    this.serviceService.updateScreenById(id, this.serviceModel).subscribe(async (rp: any) => { })
    this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${id}/true`])
  }

  async deleteService() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.selectedTerapeuta != "" || this.selectedEncargada != "" ||
          this.selectedDateStart || this.selectedDateEnd != "") {
          Swal.fire({
            title: '¿Deseas eliminar el registro?',
            text: "Una vez eliminados ya no se podrán recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Deseo eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.ionLoaderService.simpleLoader()
              Swal.fire({
                title: '¿Estas seguro de eliminar?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Deseo eliminar!'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.serviceTherapist.getTerapeuta(this.idService[0]['terapeuta']).subscribe((rp: any) => {
                    this.serviceTherapist.updateHoraAndSalida(rp[0].nombre, rp[0]).subscribe((rp: any) => { })
                  })

                  for (let i = 0; i < this.idService.length; i++) {
                    this.serviceService.deleteServicio(this.idService[i]['id']).subscribe((rp: any) => {
                    })
                  }

                  this.getServices()
                  this.ionLoaderService.dismissLoader()
                  Swal.fire({ position: 'center', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1500 })
                  this.emptyFilter()
                }
                else {
                  this.ionLoaderService.dismissLoader()
                }
              })
            }
          })
        }
      }
    })
  }

  emptyFilter() {
    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.fechaInicio = ""
    this.fechaFinal = ""
    this.selectedFormPago = ""
    this.filtredBusqueda = ""
  }

  filtersss() {
    this.filter = true
  }

  aqui() {
    if (this.details == false) {
      this.details = true
      document.getElementById('segundo').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo2').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo3').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo4').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo5').style.top = 'calc(70% - 163px)'
    } else {
      document.getElementById('segundo').style.top = '41px'
      document.getElementById('segundo2').style.top = '102px'
      document.getElementById('segundo3').style.top = '102px'
      document.getElementById('segundo4').style.top = '102px'
      document.getElementById('segundo5').style.top = '102px'
      this.details = false
    }
  }

  search() {
    if (this.textSearch == false) {
      this.textSearch = true
    } else {
      this.textSearch = false
    }
  }

  textsearch() {
    this.filterSearch = this.filterSearch.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

    const searchCondition = serv => {
      if (!this.filterSearch) return true
      const criterio = this.filterSearch
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }
  }

  exportExcel() {
    this._workbook = new Workbook();

    this._workbook.creator = 'Servicios realizados';

    this.createBook();

    this._workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, 'Servicios Realizados.xlsx');
    });
  }

  createBook() {
    const sheet = this._workbook.addWorksheet('Servicios Realizados')

    // ESTABLECEMOS EL ANCHO Y ESTILO DE LAS COLUMNAS
    sheet.getColumn('B').width = 21
    sheet.getColumn('C').width = 21
    sheet.getColumn('D').width = 21
    sheet.getColumn('E').width = 21
    sheet.getColumn('F').width = 21
    sheet.getColumn('G').width = 21
    sheet.getColumn('H').width = 21
    sheet.getColumn('I').width = 21
    sheet.getColumn('J').width = 21
    sheet.getColumn('K').width = 21
    sheet.getColumn('L').width = 21
    sheet.getColumn('M').width = 21
    sheet.getColumn('N').width = 21
    sheet.getColumn('O').width = 21
    sheet.getColumn('P').width = 21
    sheet.getColumn('Q').width = 21
    sheet.getColumn('R').width = 21
    sheet.getColumn('S').width = 21
    sheet.getColumn('T').width = 21
    sheet.getColumn('U').width = 21

    //AGREGAMOS UN TITULO
    const titleCell = sheet.getCell('C2')
    titleCell.value = 'SERVICIOS REALIZADOS'
    titleCell.style.font = { bold: true, size: 18 }

    const headerRow = sheet.getRow(4)
    // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc
    headerRow.values = [
      '', // column A
      'Encargada', // column B
      'Fecha', // column C
      'Terapeuta', // column D
      'Tiempo', // column E
      'Minuto', // column F
      'Total', // column G
      'Pago', // column H
      'Salida', // column I
      'Tratamiento', // column J
      '€ A piso 1', // column K
      '€ A piso 2', // column L
      '€ A terap.', // column M
      '€ A enc.', // column N
      '€ A otros', // column O
      'Bebida', // column P
      'Tabaco', // column Q
      'Vitamina', // column R
      'Propina', // column S
      'Otros', // column T
      'Cliente', // column U
    ];

    headerRow.font = { bold: true, size: 12 }

    // INSERTAMOS LOS DATOS EN LAS RESPECTIVAS COLUMNAS
    const rowsToInsert = sheet.getRows(5, this.idService.length)

    for (let o = 0; o < rowsToInsert.length; o++) {
      const itemData = this.servicio[o] // obtenemos el item segun el o de la iteracion (recorrido)
      const row = rowsToInsert[o] // obtenemos la primera fila segun el index de la iteracion (recorrido)

      row.values = [
        '',
        itemData.encargada, // column B
        itemData.fecha, // column C
        itemData.terapeuta, // column D
        itemData.horaStart + ' - ' + itemData.horaEnd, // column E
        itemData.minuto + ' min', // column F
        itemData.totalServicio + ' €', // column G
        itemData.formaPago, // column H
        itemData.salida, // column I
        itemData.servicio + ' €', // column J
        itemData.numberPiso1 + ' €', // column K
        itemData.numberPiso2 + ' €', // column L
        itemData.numberTerap + ' €', // column M
        itemData.numberEncarg + ' €', // column N
        itemData.numberTaxi + ' €', // column O
        itemData.bebidas + ' €', // column P
        itemData.tabaco + ' €', // column Q
        itemData.vitaminas + ' €', // column R
        itemData.propina + ' €', // column S
        itemData.otros + ' €', // column T
        itemData.cliente, // column U
      ]
    }
  }

  close() {
    this.filter = false
  }
}
