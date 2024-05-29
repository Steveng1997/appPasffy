import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Platform } from '@ionic/angular';

// Excel
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

// Model
import { ModelService } from 'src/app/core/models/service';

// Services
import { ServiceService } from 'src/app/core/services/service/service.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit {

  page!: number

  details: boolean = false
  totals: boolean = false
  textSearch: boolean = false
  filter: boolean = false
  administratorRole: boolean = false
  deletButton: boolean = false
  today: boolean = true
  notas: boolean = false

  filterSearch: string

  idService: any
  detailService: any
  deleteButton: any

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

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

  servicio: any
  horario: any

  idUser: number
  idDetail: number

  // Servicios
  totalServicio: number
  totalValor: number

  // Services String
  TotalValueLetter: string
  TotalServiceLetter: string

  // Conteo fecha
  count: number = 0
  atrasCount: number = 0
  siguienteCount: number = 0
  fechaFormat = new Date()

  defaultTouch: boolean = false

  // Excel
  private _workbook!: Workbook;

  serviceModel: ModelService = {
    pantalla: ""
  }

  date: string
  minute: number
  total: number
  payment: string
  client: string
  exit: string
  treatment: string
  therapist: string
  therapisth: string
  house1: string
  house2: string
  hourstart: string
  hourend: string
  therap: string
  manag: string
  taxi: string
  drinkHouse: string
  drinkTherap: string
  tabacco: string
  vitamin: string
  tip: string
  others: string

  // Totals
  totalTreatment: string
  totalHouse1: string
  totalHouse2: string
  totalManager: string
  totalTherapist: string
  totalTaxi: string
  totalDrinkHouse: string
  totalDrinkTherap: string
  totalTobacco: string
  totalVitamin: string
  totalTip: string
  totalOthers: string

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private ionLoaderService: IonLoaderService,
    private serviceService: ServiceService,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService
  ) { }

  async ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(params['id'])
    this.deleteButton = false
    localStorage.clear();
    this.todaysDdate()

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
    this.platformPause()
  }

  platformPause() {
    this.platform.resume.subscribe(async () => {
      const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
      this.idUser = Number(params['id'])
      localStorage.clear();
      this.todaysDdate()

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
      this.platformPause()
    })
  }

  emptyTotals() {
    if (this.totalServicio == undefined) this.totalServicio = 0
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

  getServices = async () => {
    let service
    this.dateTodayCurrent = 'HOY'
    this.serviceManager.getById(this.idUser).subscribe((rp) => {
      if (rp[0]['rol'] == 'administrador') {
        this.serviceService.getFechaHoy(this.dateStart).subscribe((rp: any) => {
          this.servicio = rp
          service = rp

          if (rp.length != 0) {
            this.totalSumOfServices(service)
          }
          return service
        })
      } else {
        this.serviceService.getEncargadaAndDate(this.dateStart, rp[0]['nombre']).subscribe((rp: any) => {
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

  filters() {
    this.serviceService.getServicio().subscribe((rp: any) => {
      this.servicio = rp
      this.calculateSumOfServices()
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

    const searchCondition = serv => {
      if (!this.filterSearch) return true
      const criterio = this.filterSearch
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

      // Filter by Valor Total
      const valorTotal = this.servicio.filter(serv => therapistCondition(serv)
        && managerCondition(serv) && conditionBetweenDates(serv)
        && conditionBetweenHours(serv) && searchCondition(serv) && wayToPay(serv))
      this.totalValor = valorTotal.reduce((accumulator, serv) => {
        this.idService = valorTotal
        this.servicio = valorTotal
        return accumulator + serv.totalServicio
      }, 0)
    }

    if (this.totalValor > 0) {
      this.deleteButton = true
      document.getElementById('trash2').style.stroke = 'red'
    }
    else {
      this.deleteButton = false
      document.getElementById('trash2').style.stroke = 'white'      
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
  }

  totalSumOfServices(element) {
    const totalServ = element.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.idService = element
    this.totalServicio = totalServ

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

  notes() {
    this.details = false
    this.notas = true
  }

  updateNote() {
    this.serviceService.updateNote(this.idDetail, this.serviceModel).subscribe(async (rp: any) => {
      this.serviceService.getServicio().subscribe(async (rp: any) => {
        this.servicio = rp
        this.notas = false
      })
    })
  }

  arrowLeft() {
    document.querySelector('.column').scrollLeft += 30;
    document.getElementById('arrowLeft').style.display = 'none'
  }

  async deleteService() {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        if (this.selectedTerapeuta != undefined || this.selectedEncargada != undefined ||
          this.selectedDateStart != undefined || this.selectedDateEnd != undefined) {
          Swal.fire({
            heightAuto: false,
            position: 'top-end',
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
                heightAuto: false,
                position: 'top-end',
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
                  Swal.fire({ heightAuto: false, position: 'center', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1500 })
                  this.emptyFilter()
                } else {
                  this.ionLoaderService.dismissLoader()
                }
              })
            }
          })
        }
      } else {
        Swal.fire({
          heightAuto: false, position: 'top-end', icon: 'error', title: '¡Oops...!', showConfirmButton: false, timer: 2500,
          text: 'No tienes autorización para borrar, si deseas eliminar el servicio habla con el adminisitrador del sistema'
        })
      }
    })
  }

  emptyFilter() {
    this.selectedTerapeuta = ""
    this.selectedEncargada = ""
    this.fechaInicio = ""
    this.fechaFinal = ""
    localStorage.clear();
    document.getElementById('bizum1').style.background = ""
    document.getElementById('cash1').style.background = ""
    document.getElementById('card1').style.background = ""
    document.getElementById('transaction1').style.background = ""
  }

  btnFilter() {
    if (this.filter == true) {
      this.filter = false
    } else {
      this.filter = true
      this.validateCheck()
    }
  }

  ajustDate(date: string) {
    let day = '', month = '', year = ''
    day = date.substring(8, 10)
    month = date.substring(5, 7)
    year = date.substring(0, 4)
    this.date = `${day}/${month}/${year}`
  }

  detail(services: any) {
    this.idDetail = services.id

    this.serviceModel.nota = services.nota
    this.ajustDate(services.fechaHoyInicio)

    if (this.details == false && this.notas == false) {
      this.details = true
      this.minute = services.minuto
      this.total = services.totalServicio
      this.payment = services.formaPago
      this.client = services.cliente

      if (services.salida != "") this.exit = services.salida
      else this.exit = 'N/A'

      this.treatment = services.servicio
      this.house1 = services.numberPiso1
      this.house2 = services.numberPiso2
      this.hourstart = services.horaStart
      this.hourend = services.horaEnd
      this.therap = services.numberTerap
      this.therapist = services.numberTerap
      this.manag = services.numberEncarg
      this.taxi = services.taxi
      this.drinkHouse = services.bebidas
      this.drinkTherap = services.bebidaTerap
      this.tabacco = services.tabaco
      this.vitamin = services.vitaminas
      this.tip = services.propina
      this.others = services.otros
      this.therapisth = services.terapeuta
    } else {
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

    serv => {
      if (!this.filterSearch) return true
      const criterio = this.filterSearch
      return (serv.terapeuta.match(criterio)
        || serv.encargada.match(criterio)
        || serv.formaPago.match(criterio)
        || serv.fecha.match(criterio)
        || serv.cliente.match(criterio)) ? true : false
    }

    this.calculateSumOfServices()
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

  bizum() {
    if (document.getElementById('bizum1').style.background == "") {
      document.getElementById('bizum1').style.background = '#1fb996'
      this.selectedFormPago = 'Bizum'
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.setItem('Bizum', 'Bizum');
    } else {
      document.getElementById('bizum1').style.background = ""
      this.selectedFormPago = ''
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.removeItem('Bizum')
    }

    this.calculateSumOfServices()
  }

  cash() {
    if (document.getElementById('cash1').style.background == "") {
      document.getElementById('cash1').style.background = '#1fb996'
      this.selectedFormPago = 'Efectivo'
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.setItem('Efectivo', 'Efectivo');
    } else {
      document.getElementById('cash1').style.background = ""
      this.selectedFormPago = ''
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.removeItem('Efectivo')
    }

    this.calculateSumOfServices()
  }

  card() {
    if (document.getElementById('card1').style.background == "") {
      document.getElementById('card1').style.background = '#1fb996'
      this.selectedFormPago = 'Tarjeta'
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.setItem('Tarjeta', 'Tarjeta');
    } else {
      document.getElementById('card1').style.background = ""
      this.selectedFormPago = ''
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.removeItem('Tarjeta')
    }

    this.calculateSumOfServices()
  }

  transaction() {
    if (document.getElementById('transaction1').style.background == "") {
      document.getElementById('transaction1').style.background = '#1fb996'
      this.selectedFormPago = 'Trans'
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.setItem('Trans', 'Trans');
    } else {
      document.getElementById('transaction1').style.background = ""
      this.selectedFormPago = ''
      serv => { return (this.selectedFormPago) ? serv.formaPago.indexOf(this.selectedFormPago) > -1 : true }
      localStorage.removeItem('Trans')
    }

    this.calculateSumOfServices()
  }

  closeDetail() {
    this.details = false
  }

  closeTotals() {
    this.totals = false
  }

  closeNotes() {
    this.notas = false
  }

  validateCheck() {
    let Bizum = localStorage.getItem('Bizum');
    let Cash = localStorage.getItem('Efectivo');
    let Card = localStorage.getItem('Tarjeta');
    let Trans = localStorage.getItem('Trans');
    setTimeout(() => {
      if (Bizum != null) {
        document.getElementById('bizum1').style.background = '#1fb996'
      }
      if (Cash != null) {
        document.getElementById('cash1').style.background = '#1fb996'
      }
      if (Bizum != null) {
        document.getElementById('bizum1').style.background = '#1fb996'
      }
      if (Card != null) {
        document.getElementById('card1').style.background = '#1fb996'
      }
      if (Trans != null) {
        document.getElementById('transaction1').style.background = '#1fb996'
      }
    }, 100);
  }

  backArrow = async () => {
    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0,
      añoHoy = 0, convertMesHoy = ''

    this.totals = false
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            this.serviceService.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
            })
          } else {

            this.serviceService.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            this.serviceService.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
            })
          } else {

            this.serviceService.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
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

    this.totals = false
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {
            this.serviceService.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
            })
          } else {

            this.serviceService.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
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

        this.serviceManager.getById(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            this.serviceService.getFechaHoy(fechaActualmente).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
              } else {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
                this.TotalValueLetter = '0'
              }
            })
          } else {

            this.serviceService.getEncargadaAndDate(fechaActualmente, rp[0]['nombre']).subscribe((rp: any) => {
              if (rp.length > 0) {
                this.servicio = rp
                this.totalValor = rp.map(({ totalServicio }) => totalServicio).reduce((acc, value) => acc + value, 0)
                this.thousandPoint()
              } else {
                this.servicio = rp
                this.TotalValueLetter = '0'
              }
            })
          }
        })

        this.siguienteCount = this.count
        return true
      }
    }
    return false
  }

  edit() {
    this.serviceModel.pantalla = 'services'
    this.serviceService.updateScreenById(this.idDetail, this.serviceModel).subscribe(async (rp: any) => { })
    this.router.navigate([`tabs/${this.idUser}/edit-services/${this.idDetail}`])
  }

  deleteAll() {
    if (this.deleteButton == true) {
      this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
        if (rp[0]['rol'] == 'administrador') {
          Swal.fire({
            heightAuto: false,
            position: 'top-end',
            title: '¿Deseas eliminar el registro?',
            text: "Una vez eliminados ya no se podrán recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Deseo eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                heightAuto: false,
                position: 'top-end',
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
                    console.log(this.idService)
                    this.serviceService.deleteServicio(this.idService[i]['id']).subscribe((rp: any) => {
                    })
                  }

                  this.getServices()
                  Swal.fire({ heightAuto: false, position: 'center', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1500 })
                }
              })
            }
          })
        } else {
          Swal.fire({
            heightAuto: false, position: 'top-end', icon: 'error', title: '¡Oops...!', showConfirmButton: false, timer: 2500,
            text: 'No tienes autorización para borrar, si deseas eliminar el servicio habla con el adminisitrador del sistema'
          })
        }
      })
    }
  }

  delete(id: number) {
    this.serviceManager.getById(this.idUser).subscribe(async (rp) => {
      if (rp[0]['rol'] == 'administrador') {
        Swal.fire({
          heightAuto: false,
          position: 'top-end',
          title: '¿Deseas eliminar el registro?',
          text: "Una vez eliminados ya no se podrán recuperar",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              heightAuto: false,
              position: 'top-end',
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
                  this.serviceService.deleteServicio(id).subscribe((rp: any) => {
                  })
                }

                this.getServices()
                Swal.fire({ heightAuto: false, position: 'center', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1500 })
                this.details = false
              }
            })
          }
        })
      } else {
        Swal.fire({
          heightAuto: false, position: 'top-end', icon: 'error', title: '¡Oops...!', showConfirmButton: false, timer: 2500,
          text: 'No tienes autorización para borrar, si deseas eliminar el servicio habla con el adminisitrador del sistema'
        })
      }
    })
  }

  filterTotal() {
    if (this.totals == false) {
      this.totals = true

      const totalTreatment = this.servicio.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
      let treatment = totalTreatment

      const totalHouse1 = this.servicio.map(({ numberPiso1 }) => numberPiso1).reduce((acc, value) => acc + value, 0)
      let house1 = totalHouse1

      const totalHouse2 = this.servicio.map(({ numberPiso2 }) => numberPiso2).reduce((acc, value) => acc + value, 0)
      let house2 = totalHouse2

      const totalTherapist = this.servicio.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
      let therapist = totalTherapist

      const totalManager = this.servicio.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
      let manager = totalManager

      const totalTaxi = this.servicio.map(({ taxi }) => taxi).reduce((acc, value) => acc + value, 0)
      let taxi = totalTaxi

      const totalDrinkHouse = this.servicio.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
      let drinkHouse = totalDrinkHouse

      const totalDrinkTherap = this.servicio.map(({ bebidaTerap }) => bebidaTerap).reduce((acc, value) => acc + value, 0)
      let drinkTherap = totalDrinkTherap

      const totalTobacco = this.servicio.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
      let tobacco = totalTobacco

      const totalVitamin = this.servicio.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
      let vitamin = totalVitamin

      const totalTip = this.servicio.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
      let tip = totalTip

      const totalOthers = this.servicio.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
      let others = totalOthers

      this.thousandPointTotal(treatment, house1, house2, therapist, manager, taxi, drinkHouse, drinkTherap, tobacco, vitamin, tip, others)
    } else {
      this.totals = false
    }
  }

  thousandPointTotal(treatment, house1, house2, therapist, manager, taxi, drinkHouse, drinkTherap, tobacco, vitamin, tip, others) {

    if (treatment > 999) {
      const coma = treatment.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? treatment.toString().split(".") : treatment.toString().split("");
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
      this.totalTreatment = treatment.toString()
    }

    if (house1 > 999) {
      const coma = house1.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? house1.toString().split(".") : house1.toString().split("");
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
      this.totalHouse1 = integer[0].toString()
    } else {
      this.totalHouse1 = house1.toString()
    }

    if (house2 > 999) {
      const coma = house2.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? house2.toString().split(".") : house2.toString().split("");
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
      this.totalHouse2 = integer[0].toString()
    } else {
      this.totalHouse2 = house2.toString()
    }

    if (therapist > 999) {
      const coma = therapist.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? therapist.toString().split(".") : therapist.toString().split("");
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
      this.totalTherapist = integer[0].toString()
    } else {
      this.totalTherapist = therapist.toString()
    }

    if (manager > 999) {
      const coma = manager.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? manager.toString().split(".") : manager.toString().split("");
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
      this.totalManager = integer[0].toString()
    } else {
      this.totalManager = manager.toString()
    }

    if (taxi > 999) {
      const coma = taxi.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? taxi.toString().split(".") : taxi.toString().split("");
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
      this.totalTaxi = integer[0].toString()
    } else {
      this.totalTaxi = taxi.toString()
    }

    if (drinkHouse > 999) {
      const coma = drinkHouse.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? drinkHouse.toString().split(".") : drinkHouse.toString().split("");
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
      this.totalDrinkHouse = integer[0].toString()
    } else {
      this.totalDrinkHouse = drinkHouse.toString()
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
      this.totalDrinkTherap = integer[0].toString()
    } else {
      this.totalDrinkTherap = drinkTherap.toString()
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
      this.totalTobacco = integer[0].toString()
    } else {
      this.totalTobacco = tobacco.toString()
    }

    if (vitamin > 999) {
      const coma = vitamin.toString().indexOf(".") !== -1 ? true : false;
      const array = coma ? vitamin.toString().split(".") : vitamin.toString().split("");
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
      this.totalVitamin = vitamin.toString()
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
      this.totalTip = integer[0].toString()
    } else {
      this.totalTip = tip.toString()
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
      this.totalOthers = integer[0].toString()
    } else {
      this.totalOthers = others.toString()
    }
  }

  // @HostListener('touchstart', ['$event'])
  // handleTouch(event) {
  //   var pageY = event.targetTouches[0].pageY
  //   var clientY = event.targetTouches[0].clientY
  //   var screenY = event.targetTouches[0].screenY
  //   var id = event.target.id
  //   console.log(screenY)

  //   if (screenY > 100) {
  //     if (this.defaultTouch == false) {
  //       document.getElementById('rectangle95').style.position = 'fixed'
  //       document.getElementById('rectangle95').style.top = '1px'
  //       document.getElementById('rectangle95').style.zIndex = '1'
  //       this.defaultTouch = true

  //       if (id == 'rectangle95' || id == 'frame' || id == 'detail' && screenY > 500) {
  //         document.getElementById('rectangle95').style.position = 'fixed'
  //         document.getElementById('rectangle95').style.top = '318px'
  //         document.getElementById('rectangle95').style.zIndex = '1'
  //         this.defaultTouch = true
  //       }
  //     }
  //   }

  //   if (screenY < 450) {
  //     if (this.defaultTouch == true) {
  //       if (id == 'rectangle95' || id == 'frame' || id == 'detail' && screenY < 900) {
  //         document.getElementById('rectangle95').style.position = 'absolute'
  //         document.getElementById('rectangle95').style.top = '0px'
  //         document.getElementById('rectangle95').style.zIndex = '0'
  //         this.defaultTouch = false
  //       } else {
  //         document.getElementById('rectangle95').style.position = 'absolute'
  //         document.getElementById('rectangle95').style.top = '0px'
  //         document.getElementById('rectangle95').style.zIndex = '0'
  //         this.defaultTouch = false
  //       }
  //     }
  //   }
  // }
}