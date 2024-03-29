import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  details: boolean = false
  textSearch: boolean = false
  filter: boolean = false
  filterSearch: string

  idService: any

  deleteButton: any

  fechaInicio: string
  fechaFinal: string
  horaInicio: string
  horaFinal: string

  // Terapeuta
  terapeuta: any
  selectedTerapeuta: string

  // Encargada
  manager: any
  selectedEncargada: string
  selectedFormPago: string

  dateStart: string
  dateEnd: string
  hourStart: string
  hourEnd: string
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
  totalValor: number

  // Services String
  TotalValueLetter: string
  TotalServiceLetter: string

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
    // this.details = false
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
    await this.calculateSumOfServices()
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
        return accumulator + serv.totalServicio
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
    this.router.navigate([`menu/${this.idUser}/nuevo-servicio/${id}`])
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
    // this.selectedFormPago = ""
  }

  btnFilter() {
    this.filter = true
    this.validateCheck()
  }

  detail(services: ModelService) {
    if (this.details == false) {
      this.details = true
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
        itemData.hourStart + ' - ' + itemData.hourEnd, // column E
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

  close() {
    this.filter = false
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
}
