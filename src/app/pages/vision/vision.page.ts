import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment'
import { Platform } from '@ionic/angular';
import dayjs from "dayjs";

// Service
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { ServiceService } from 'src/app/core/services/service/service.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

// Model 
import { ModelTherapist } from 'src/app/core/models/therapist';
import { ModelService } from 'src/app/core/models/service';

@Component({
  selector: 'app-vision',
  templateUrl: './vision.page.html',
  styleUrls: ['./vision.page.scss'],
})

export class VisionPage implements OnInit {

  existTherapist: boolean = false
  message: boolean = false
  diferenceMinutes: number
  tableVision: boolean = false
  loading: boolean = false

  paginaterMinute: boolean = false
  paginaterTherapist: boolean = false
  paginaterManager: boolean = false
  vision: any

  page!: number
  pageTherapist!: number
  pageManager!: number

  fechaDiaHoy = dayjs().format("YYYY-MM-DD")
  totalServicio: number
  idUser: number
  company = ''
  therapist: any
  horaEnd: string
  horaHoy: string

  // TOTALES
  totalVision: number
  totalBebida: number
  totalBebidaTherapist: number
  totalTobaccoo: number
  totalVitamina: number
  totalTipa: number
  totalTaxita: number
  totalOtros: number
  totalCollection: number

  // TOTALES formas de Pago
  totalEfectivo: number
  totalBizum: number
  totalTarjeta: number
  totalTrasnf: number
  totalTerap: number
  totalEncarg: number
  totalDriverTaxi: number
  totalPisos: number

  // Conteo fecha
  count: number = 0
  dateTodayCurrent: string
  day: number
  month: string
  atrasCount: number = 0
  siguienteCount: number = 0
  fechaFormat = new Date()

  // string Number
  totalTreatment: string
  totalDrinks: string
  totalDrinksTherapist: string
  totalTobacco: string
  totalVitamin: string
  totalTip: string
  totalTaxi: string
  totalOthers: string
  totalVisions: string
  totalPiso: string
  totalEfectiv: string
  totalBizu: string
  totalTarjet: string
  totalTrasn: string
  totalTerape: string
  totalEncargada: string
  totalDriverTaxist: string
  totalCollections: string

  // Table therapist
  therapistCount: number
  servicesTherapist = []

  // Table manager
  managerCount: number
  servicesManager = []

  therapistModel: ModelTherapist = {
    activo: true,
    bebida: "",
    fechaEnd: "",
    horaEnd: "",
    id: 0,
    minuto: 0,
    nombre: "",
    otros: "",
    propina: "",
    salida: "",
    servicio: "",
    tabaco: "",
    vitamina: "",
  }

  serviceModel: ModelService = {
    pantalla: ""
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    public service: ServiceService,
    private serviceManager: ManagerService,
    private serviceTherapist: TherapistService,
    private ionLoaderService: IonLoaderService
  ) { }

  ngOnInit() {
    let manager, element
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(params['id'])

    this.platformPause()

    this.ionLoaderService.simpleLoader()

    this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
      this.serviceManager.getIdCompany(rp['manager'].id, rp['manager'].company).subscribe(async (rp: any) => {
        this.company = rp['manager'][0].company
        this.servicesManager = rp['manager']
        manager = rp['manager']

        if (rp['manager'][0].rol == 'Administrador') {
          this.getService()
          this.getManagerall(element)
          this.tableTherapist('array', 'date')
        } else {
          this.getServiceByManager(rp['manager'][0])
          this.getManager(manager, element, 'array')
          this.tableTherapistForManager(manager, 'array', 'date')
        }
      })
    })

    this.getTherapist()
  }

  platformPause() {
    this.platform.resume.subscribe(async () => {
      let manager, element
      const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
      this.idUser = Number(params['id'])

      this.platformPause()

      this.ionLoaderService.simpleLoader()

      this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
        this.serviceManager.getIdCompany(rp['manager'][0].id, rp['manager'][0].company).subscribe(async (rp: any) => {
          this.company = rp['manager'][0].company
          this.servicesManager = rp['manager']
          manager = rp['manager']

          if (rp['manager'][0].rol == 'Administrador') {
            this.getService()
            this.getManagerall(element)
            this.tableTherapist('array', 'date')
          }

          else {
            this.getServiceByManager(rp['manager'][0])
            this.getManager(manager, element, 'array')
            this.tableTherapistForManager(manager, 'array', 'date')
          }
        })
      })

      this.getTherapist()
    })
  }

  getManagerall(element) {
    if (element == undefined) {

      this.todaysDate()
      this.serviceManager.company(this.company).subscribe((rp: any) => {
        this.servicesManager = rp

        if (rp.length > 7 && rp.length < 10) {
          let rectangle20 = 334, overview = 1958

          for (let i = 8; i <= rp.length; i++) {
            rectangle20 += 31.5, overview += 31

            document.getElementById('rectangle20').style.height = rectangle20.toString() + 'px'
            document.getElementById('overview').style.height = overview.toString() + 'px'
          }
        }

        if (rp.length >= 10) {
          this.paginaterManager = true
          document.getElementById('rectangle20').style.height = '445px'
          document.getElementById('overview').style.height = '2068px'
        }

        rp.map(item => {
          this.service.getManagerAndDates(item['nombre'], this.fechaDiaHoy, this.company).subscribe((rp: any) => {
            this.managerCount = rp.length
            item['count'] = this.managerCount

            const servicios = rp.filter(serv => serv)
            const sumatoria = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)

            item['sum'] = sumatoria

            this.servicesManager.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })
          })
        })
      })
    } else {
      this.serviceManager.getManager().subscribe((rp: any) => {
        this.servicesManager = rp

        rp.map(item => {
          this.service.getManagerAndDates(item['nombre'], element, this.company).subscribe((rp: any) => {
            this.managerCount = rp.length
            item['count'] = this.managerCount

            const servicios = rp.filter(serv => serv)
            const sumatoria = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)

            item['sum'] = sumatoria

            this.servicesManager.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })

          })
        })
      })
    }
  }

  getManager = async (element, dates, text) => {
    if (text == 'array') {
      this.todaysDate()

      this.service.getManagerAndDates(element[0]['nombre'], this.fechaDiaHoy, this.company).subscribe((rp1: any) => {
        this.managerCount = rp1.length
        this.servicesManager[0]['count'] = this.managerCount

        const unicos = [];
        const rp = rp1.reduce((acc, valor) => {
          if (!unicos.includes(valor.institucion)) {
            unicos.push(valor.institucion);
            acc.push(valor);
          }
          return acc;
        }, []);

        if (rp.length > 7 && rp.length < 10) {
          let rectangle20 = 334

          for (let i = 8; i <= rp.length; i++) {
            rectangle20 += 31.5
            document.getElementById('rectangle20').style.height = rectangle20.toString() + 'px'
          }
        }

        if (rp.length == 10) {
          document.getElementById('rectangle20').style.height = '430px'
        }

        const servicios = rp.filter(serv => serv)
        const sumatoria = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.totalServicio
        }, 0)

        if (sumatoria > 999)
          this.servicesManager[0]['sum'] = (sumatoria / 1000).toFixed(3)
        else
          this.servicesManager[0]['sum'] = sumatoria.toString()
      })
    } else {

      this.service.getManagerAndDates(element[0]['nombre'], dates, this.company).subscribe((rp1: any) => {
        this.managerCount = rp1.length
        this.servicesManager[0]['count'] = this.managerCount

        const unicos = [];
        const rp = rp1.reduce((acc, valor) => {
          if (!unicos.includes(valor.institucion)) {
            unicos.push(valor.institucion);
            acc.push(valor);
          }
          return acc;
        }, []);

        if (rp.length > 7 && rp.length < 10) {
          let rectangle20 = 334

          for (let i = 8; i <= rp.length; i++) {
            rectangle20 += 31.5
            document.getElementById('rectangle20').style.height = rectangle20.toString() + 'px'
          }
        }

        if (rp.length == 10) {
          document.getElementById('rectangle20').style.height = '430px'
        }

        const servicios = rp.filter(serv => serv)
        const sumatoria = servicios.reduce((accumulator, serv) => {
          return accumulator + serv.totalServicio
        }, 0)

        if (sumatoria > 999)
          this.servicesManager[0]['sum'] = (sumatoria / 1000).toFixed(3)
        else
          this.servicesManager[0]['sum'] = sumatoria.toString()
      })
    }
  }

  async getTherapist() {
    let therapit
    this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
      this.company = rp[0]['company']
      await this.serviceTherapist.getByCompanyOrderByMinutes(this.company).subscribe(async (rp: any) => {
        therapit = rp
        this.therapist = rp

        if (rp.length > 7 && rp.length < 10) {
          let rectangle18 = 372, currentDate = 439, stripeToday = 465, leftArrow = 471, rightArrow = 447, table2 = 1, table3 = 1,
            table4 = 1, rectangle182 = 334, table5 = 15, overview = 1958

          for (let i = 8; i <= rp.length; i++) {
            rectangle18 += 31.5, currentDate += 31, stripeToday += 31, leftArrow += 32.4, rightArrow += 31, table2 += 31, table3 += 31,
              table4 += 30, rectangle182 += 31.5, table5 += 63, overview += 63

            document.getElementById('rectangle18').style.height = rectangle18.toString() + 'px'
            document.getElementById('currentDate').style.top = currentDate.toString() + 'px'
            document.getElementById('stripeToday').style.top = stripeToday.toString() + 'px'
            document.getElementById('leftArrow').style.top = leftArrow.toString() + 'px'
            document.getElementById('rightArrow').style.top = rightArrow.toString() + 'px'
            document.getElementById('table2').style.top = table2.toString() + 'px'
            document.getElementById('table3').style.top = table3.toString() + 'px'
            document.getElementById('table4').style.top = table4.toString() + 'px'
            document.getElementById('rectangle182').style.height = rectangle182.toString() + 'px'
            document.getElementById('table5').style.top = table5.toString() + 'px'
            document.getElementById('overview').style.height = overview.toString() + 'px'
          }
        }

        if (rp.length >= 10) {
          this.paginaterMinute = true
          this.paginaterTherapist = true
          document.getElementById('rectangle18').style.height = '468px'
          document.getElementById('currentDate').style.top = '536px'
          document.getElementById('stripeToday').style.top = '559.5px'
          document.getElementById('leftArrow').style.top = '568px'
          document.getElementById('rightArrow').style.top = '543px'
          document.getElementById('table2').style.top = '96px'
          document.getElementById('table3').style.top = '96px'
          document.getElementById('table4').style.top = '95px'
          document.getElementById('rectangle182').style.height = '429px'
          document.getElementById('table5').style.top = '205px'
          document.getElementById('overview').style.height = '2148px'
        }

        await this.getMinute(therapit)
      })
    })
  }

  tableTherapist(text, dateCurent) {
    this.existTherapist = true
    this.message = false

    if (text == 'array') {

      let date = new Date(), day = 0, month = 0, year = 0, convertDay = '', convertMonth = '', dates = ''

      day = date.getDate()
      month = date.getMonth() + 1
      year = date.getFullYear()

      if (day > 0 && day < 10) {
        convertDay = '0' + day
        dates = `${year}-${month}-${convertDay}`
      } else {
        day = day
        convertDay = day.toString()
        dates = `${year}-${month}-${day}`
      }

      if (month > 0 && month < 10) {
        convertMonth = '0' + month
        dates = `${year}-${convertMonth}-${convertDay}`
      } else {
        month = month
        dates = `${year}-${month}-${convertDay}`
      }

      this.serviceTherapist.company(this.company).subscribe((rp: any) => {
        this.servicesTherapist = rp

        rp.map(item => {
          this.service.getTherapistAndDates(item['nombre'], dates, this.company).subscribe((rp: any) => {
            this.therapistCount = rp.length
            item['count'] = this.therapistCount

            const servicios = rp.filter(serv => serv)
            item['sum'] = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)

            this.servicesTherapist.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })

          })
        })
      })

    } else {

      this.serviceTherapist.company(this.company).subscribe((rp: any) => {
        this.servicesTherapist = rp

        rp.map(item => {
          this.service.getTherapistAndDates(item['nombre'], dateCurent, this.company).subscribe((rp: any) => {
            this.therapistCount = rp.length
            item['count'] = this.therapistCount

            const servicios = rp.filter(serv => serv)
            item['sum'] = servicios.reduce((accumulator, serv) => {
              return accumulator + serv.totalServicio
            }, 0)

            this.servicesTherapist.sort(function (a, b) {
              if (a.sum > b.sum) {
                return -1;
              }
              if (a.sum < b.sum) {
                return 1;
              }

              return 0;
            })

          })
        })
      })
    }
  }

  async tableTherapistForManager(element, text, dateCurrent) {
    this.existTherapist = false
    this.message = false

    if (text == 'array') {

      let date = new Date(), day = 0, month = 0, year = 0, convertDay = '', convertMonth = '', dates = ''

      day = date.getDate()
      month = date.getMonth() + 1
      year = date.getFullYear()

      if (day > 0 && day < 10) {
        convertDay = '0' + day
        dates = `${year}-${month}-${convertDay}`
      } else {
        day = day
        convertDay = day.toString()
        dates = `${year}-${month}-${day}`
      }

      if (month > 0 && month < 10) {
        convertMonth = '0' + month
        dates = `${year}-${convertMonth}-${convertDay}`
      } else {
        month = month
        dates = `${year}-${month}-${convertDay}`
      }

      this.service.getTherapistConsultingManagerAndDate(element[0]['nombre'], dates, this.company).subscribe(async (rp: any) => {
        this.servicesTherapist = rp

        rp.map(item => {
          item['nombre'] = item['terapeuta']

          this.service.getTherapistAndManagerAndDates(item['terapeuta'], element[0]['nombre'], dates, this.company).subscribe((rp: any) => {
            if (rp.length > 0) {
              this.existTherapist = true

              this.therapistCount = rp.length
              item['count'] = this.therapistCount

              const servicios = rp.filter(serv => serv)
              const sumatoria = servicios.reduce((accumulator, serv) => {
                return accumulator + serv.totalServicio
              }, 0)

              item['sum'] = sumatoria

              this.servicesTherapist.sort(function (a, b) {
                if (a.sum > b.sum) {
                  return -1
                }
                if (a.sum < b.sum) {
                  return 1
                }

                return 0
              })
            } else {
              this.message = true
            }

          })
        })
      })

    } else {
      this.service.getTherapistConsultingManagerAndDate(element[0]['nombre'], dateCurrent, this.company).subscribe((rp: any) => {
        this.servicesTherapist = rp

        rp.map(item => {
          item['nombre'] = item['terapeuta']

          this.service.getTherapistAndManagerAndDates(item['terapeuta'], element[0]['nombre'], dateCurrent, this.company).subscribe((rp: any) => {

            if (rp.length > 0) {
              this.existTherapist = true
              this.therapistCount = rp.length
              item['count'] = this.therapistCount

              const servicios = rp.filter(serv => serv)
              const sumatoria = servicios.reduce((accumulator, serv) => {
                return accumulator + serv.totalServicio
              }, 0)

              item['sum'] = sumatoria

              this.servicesTherapist.sort(function (a, b) {
                if (a.sum > b.sum) {
                  return -1;
                }
                if (a.sum < b.sum) {
                  return 1;
                }

                return 0;
              })
            } else {
              this.message = true
            }
          })
        })
      })
    }
  }

  totalsAtZero() {
    this.totalPisos = 0
    this.totalVision = 0
    this.totalServicio = 0
    this.totalDrinks = '0'
    this.totalDrinksTherapist = '0'
    this.totalTobaccoo = 0
    this.totalVitamina = 0
    this.totalTipa = 0
    this.totalTaxita = 0
    this.totalOtros = 0
    this.totalEfectivo = 0
    this.totalBizum = 0
    this.totalTarjeta = 0
    this.totalTrasnf = 0
    this.totalTerap = 0
    this.totalDriverTaxi = 0
    this.totalCollection = 0
    this.totalTreatment = '0'
    this.totalTobacco = '0'
    this.totalVitamin = '0'
    this.totalTip = '0'
    this.totalTaxi = '0'
    this.totalOthers = '0'
    this.totalVisions = '0'
    this.totalPiso = '0'
    this.totalEfectiv = '0'
    this.totalBizu = '0'
    this.totalTarjet = '0'
    this.totalTrasn = '0'
    this.totalTerape = '0'
    this.totalEncargada = '0'
    this.totalDriverTaxist = '0'
    this.totalCollections = '0'
  }

  async getServiceByManager(manager: string) {
    this.todaysDate()
    this.dateTodayCurrent = 'HOY'
    this.service.getEncargadaAndDate(this.fechaDiaHoy, manager['nombre'], this.company).subscribe((rp: any) => {
      this.vision = rp

      if (rp.length != 0) {
        this.totalVisionSum()
      } else {
        this.totalsAtZero()
      }

      this.loading = false
      this.tableVision = true
    })
  }

  async getMinute(element) {
    if (element.length > 0) {
      for (let u = 0; u < element.length; u++) {
        if (element[u].horaEnd != "") {
          await this.minuteDifference(element)
          this.ionLoaderService.dismissLoader()
        }
        else {
          if (element[u]['fechaEnd'] == "") {
            this.diferenceMinutes = 0
            this.updateHourAndExit(element, u)
            this.ionLoaderService.dismissLoader()
          }
        }
      }
    } else {
      this.ionLoaderService.dismissLoader()
    }
  }

  async todaysDate() {
    let month = '', mes = this.fechaDiaHoy.substring(5, 7)

    if (mes == "12") month = 'Diciembre'
    if (mes == "11") month = 'Noviembre'
    if (mes == "10") month = 'Octubre'
    if (mes == "09") month = 'Septiembre'
    if (mes == "08") month = 'Agosto'
    if (mes == "07") month = 'Julio'
    if (mes == "06") month = 'Junio'
    if (mes == "05") month = 'Mayo'
    if (mes == "04") month = 'Abril'
    if (mes == "03") month = 'Marzo'
    if (mes == "02") month = 'Febrero'
    if (mes == "01") month = 'Enero'

    debugger

    this.day = Number(this.fechaDiaHoy.substring(8, 10))
    this.month = month
  }

  async getService() {
    this.todaysDate()
    this.dateTodayCurrent = 'HOY'

    this.service.getFechaHoy(this.fechaDiaHoy, this.company).subscribe((datoServicio: any) => {
      this.vision = datoServicio

      if (datoServicio.length != 0) {
        this.totalVisionSum()
      } else {
        this.totalsAtZero()
      }
    })

    this.loading = false
    this.tableVision = true
  }

  async updateHourAndExit(element, o) {
    if (this.diferenceMinutes <= 0) {
      element[o]['minuto'] = 0
      element[o]['fechaEnd'] = ''
      element[o]['horaEnd'] = ''
      element[o]['salida'] = ''
      await this.serviceTherapist.updateItems(element[o]['nombre'], element[o]).subscribe(() => {
      })
    }
  }

  async updateMinute(element, o) {
    let minute, convertMinute = 0
    if (this.diferenceMinutes > 0) {
      element[o]['minuto'] = this.diferenceMinutes
      await this.serviceTherapist.updateMinutes(element[o]['id'], element[o]).subscribe((rp: any) => {
        minute = this.therapist.filter(serv => serv.minuto > 0)
        if (minute.length > 0) convertMinute = minute[0].minuto * 60000
        if (convertMinute > 0) {
          this.ionLoaderService.dismissLoader()
        }
      })
    }
  }

  async minuteDifference(element) {

    for (let o = 0; o < element.length; o++) {

      if (element[o]['fechaEnd'] != "") {
        let date = new Date(), day = 0, convertDay = '', month = 0, year = 0, hour = new Date().toTimeString().substring(0, 8), dayEnd = '', monthEnd = '', yearEnd = ''

        dayEnd = element[o]['fechaEnd'].substring(0, 2)
        monthEnd = element[o]['fechaEnd'].substring(3, 5)
        yearEnd = element[o]['fechaEnd'].substring(6, 9)
        yearEnd = + '20' + yearEnd

        var date1 = moment(`${yearEnd}-${monthEnd}-${dayEnd} ${element[o]['horaEnd']}`, "YYYY-MM-DD HH:mm")

        // Date 2

        day = date.getDate()
        month = date.getMonth() + 1
        year = date.getFullYear()

        if (day > 0 && day < 10) {
          convertDay = '0' + day
          var date2 = moment(`${year}-${month}-${convertDay} ${hour}`, "YYYY-MM-DD HH:mm")
        } else {
          day = day
          var date2 = moment(`${year}-${month}-${day} ${hour}`, "YYYY-MM-DD HH:mm:ss")
        }

        this.diferenceMinutes = date1.diff(date2, 'minute')

        this.updateMinute(element, o)
        this.updateHourAndExit(element, o)
      }
    }
  }

  async validateTheEmptyField() {
    if (this.totalTreatment == undefined) this.totalTreatment = '0'
    if (this.totalDrinks == undefined) this.totalDrinks = '0'
    if (this.totalDrinksTherapist == undefined) this.totalDrinksTherapist = '0'
    if (this.totalTobacco == undefined) this.totalTobacco = '0'
    if (this.totalVitamin == undefined) this.totalVitamin = '0'
    if (this.totalTip == undefined) this.totalTip = '0'
    if (this.totalTaxi == undefined) this.totalTaxi = '0'
    if (this.totalOthers == undefined) this.totalOthers = '0'
    if (this.totalVisions == undefined) this.totalVisions = '0'

    if (this.totalPiso == undefined) this.totalPiso = '0'
    if (this.totalEfectiv == undefined) this.totalEfectiv = '0'
    if (this.totalBizu == undefined) this.totalBizu = '0'
    if (this.totalTarjet == undefined) this.totalTarjet = '0'
    if (this.totalTrasn == undefined) this.totalTrasn = '0'
    if (this.totalTerape == undefined) this.totalTerape = '0'
    if (this.totalEncargada == undefined) this.totalEncargada = '0'
    if (this.totalDriverTaxist == undefined) this.totalDriverTaxist = '0'
    if (this.totalCollections == undefined) this.totalCollections = '0'
  }

  // Suma de TOTALES
  totalVisionSum() {
    let efectPiso1 = 0, efectPiso2 = 0, bizumPiso1 = 0, bizumPiso2 = 0, tarjetaPiso1 = 0, tarjetaPiso2 = 0,
      transfPiso1 = 0, transfPiso2 = 0

    const totalServ = this.vision.map(({ servicio }) => servicio).reduce((acc, value) => acc + value, 0)
    this.totalServicio = totalServ

    if (this.totalServicio > 999)
      this.totalTreatment = (this.totalServicio / 1000).toFixed(3)
    else
      this.totalTreatment = this.totalServicio.toString()

    const totalValorBebida = this.vision.map(({ bebidas }) => bebidas).reduce((acc, value) => acc + value, 0)
    this.totalBebida = totalValorBebida

    if (this.totalBebida > 999)
      this.totalDrinks = (this.totalBebida / 1000).toFixed(3)
    else
      this.totalDrinks = this.totalBebida.toString()

    const totalValueDrinkTherapist = this.vision.map(({ bebidaTerap }) => bebidaTerap).reduce((acc, value) => acc + value, 0)
    this.totalBebidaTherapist = totalValueDrinkTherapist

    if (this.totalBebidaTherapist > 999)
      this.totalDrinksTherapist = (this.totalBebidaTherapist / 1000).toFixed(3)
    else
      this.totalDrinksTherapist = this.totalBebidaTherapist.toString()

    const totalValorTab = this.vision.map(({ tabaco }) => tabaco).reduce((acc, value) => acc + value, 0)
    this.totalTobaccoo = totalValorTab

    if (this.totalTobaccoo > 999)
      this.totalTobacco = (this.totalTobaccoo / 1000).toFixed(3)
    else
      this.totalTobacco = this.totalTobaccoo.toString()

    const totalValorVitamina = this.vision.map(({ vitaminas }) => vitaminas).reduce((acc, value) => acc + value, 0)
    this.totalVitamina = totalValorVitamina

    if (this.totalVitamina > 999)
      this.totalVitamin = (this.totalVitamina / 1000).toFixed(3)
    else
      this.totalVitamin = this.totalVitamina.toString()

    const totalValorProp = this.vision.map(({ propina }) => propina).reduce((acc, value) => acc + value, 0)
    this.totalTipa = totalValorProp

    if (this.totalTipa > 999)
      this.totalTip = (this.totalTipa / 1000).toFixed(3)
    else
      this.totalTip = this.totalTipa.toString()

    const totalValueTaxi = this.vision.map(({ taxi }) => taxi).reduce((acc, value) => acc + value, 0)
    this.totalTaxita = totalValueTaxi

    if (this.totalTaxita > 999)
      this.totalTaxi = (this.totalTaxita / 1000).toFixed(3)
    else
      this.totalTaxi = this.totalTaxita.toString()

    const totalValorOtroServicio = this.vision.map(({ otros }) => otros).reduce((acc, value) => acc + value, 0)
    this.totalOtros = totalValorOtroServicio

    if (this.totalOtros > 999)
      this.totalOthers = (this.totalOtros / 1000).toFixed(3)
    else
      this.totalOthers = this.totalOtros.toString()

    this.totalVision = this.totalServicio + this.totalBebida + this.totalBebidaTherapist + this.totalTobaccoo + this.totalTaxita +
      this.totalVitamina + this.totalTipa + this.totalOtros

    if (this.totalVision > 999)
      this.totalVisions = (this.totalVision / 1000).toFixed(3)
    else
      this.totalVisions = this.totalVision.toString()

    // total de las Formas de pagos

    const totalPiso1Efect = this.vision.map(({ valuePiso1Efectivo }) => valuePiso1Efectivo).reduce((acc, value) => acc + value, 0)
    efectPiso1 = totalPiso1Efect

    const totalPiso2Efect = this.vision.map(({ valuePiso2Efectivo }) => valuePiso2Efectivo).reduce((acc, value) => acc + value, 0)
    efectPiso2 = totalPiso2Efect

    this.totalEfectivo = efectPiso1 + efectPiso2

    if (this.totalEfectivo > 999)
      this.totalEfectiv = (this.totalEfectivo / 1000).toFixed(3)
    else
      this.totalEfectiv = this.totalEfectivo.toString()

    const totalPiso1Bizum = this.vision.map(({ valuePiso1Bizum }) => valuePiso1Bizum).reduce((acc, value) => acc + value, 0)
    bizumPiso1 = totalPiso1Bizum

    const totalPiso2Bizum = this.vision.map(({ valuePiso2Bizum }) => valuePiso2Bizum).reduce((acc, value) => acc + value, 0)
    bizumPiso2 = totalPiso2Bizum

    this.totalBizum = bizumPiso1 + bizumPiso2

    if (this.totalBizum > 999)
      this.totalBizu = (this.totalBizum / 1000).toFixed(3)
    else
      this.totalBizu = this.totalBizum.toString()

    const totalPiso1Tarjeta = this.vision.map(({ valuePiso1Tarjeta }) => valuePiso1Tarjeta).reduce((acc, value) => acc + value, 0)
    tarjetaPiso1 = totalPiso1Tarjeta

    const totalPiso2Tarjeta = this.vision.map(({ valuePiso2Tarjeta }) => valuePiso2Tarjeta).reduce((acc, value) => acc + value, 0)
    tarjetaPiso2 = totalPiso2Tarjeta

    this.totalTarjeta = tarjetaPiso1 + tarjetaPiso2

    if (this.totalTarjeta > 999)
      this.totalTarjet = (this.totalTarjeta / 1000).toFixed(3)
    else
      this.totalTarjet = this.totalTarjeta.toString()

    const totalPiso1Transaccion = this.vision.map(({ valuePiso1Transaccion }) => valuePiso1Transaccion).reduce((acc, value) => acc + value, 0)
    transfPiso1 = totalPiso1Transaccion

    const totalPiso2Transaccion = this.vision.map(({ valuePiso2Transaccion }) => valuePiso2Transaccion).reduce((acc, value) => acc + value, 0)
    transfPiso2 = totalPiso2Transaccion

    this.totalTrasnf = transfPiso1 + transfPiso2

    if (this.totalTrasnf > 999)
      this.totalTrasn = (this.totalTrasnf / 1000).toFixed(3)
    else
      this.totalTrasn = this.totalTrasnf.toString()

    const totalValorTerapeuta = this.vision.map(({ numberTerap }) => numberTerap).reduce((acc, value) => acc + value, 0)
    this.totalTerap = totalValorTerapeuta

    if (this.totalTerap > 999)
      this.totalTerape = (this.totalTerap / 1000).toFixed(3)
    else
      this.totalTerape = this.totalTerap.toString()

    const totalValorEncargada = this.vision.map(({ numberEncarg }) => numberEncarg).reduce((acc, value) => acc + value, 0)
    this.totalEncarg = totalValorEncargada

    if (this.totalEncarg > 999)
      this.totalEncargada = (this.totalEncarg / 1000).toFixed(3)
    else
      this.totalEncargada = this.totalEncarg.toString()

    const totalValueTaxDriver = this.vision.map(({ numberTaxi }) => numberTaxi).reduce((acc, value) => acc + value, 0)
    this.totalDriverTaxi = totalValueTaxDriver


    if (this.totalDriverTaxi > 999)
      this.totalDriverTaxist = (this.totalDriverTaxi / 1000).toFixed(3)
    else
      this.totalDriverTaxist = this.totalDriverTaxi.toString()

    this.totalPisos = this.totalEfectivo + this.totalBizum + this.totalTarjeta + this.totalTrasnf

    if (this.totalPisos > 999)
      this.totalPiso = (this.totalPisos / 1000).toFixed(3)
    else
      this.totalPiso = this.totalPisos.toString()

    this.totalCollection = this.totalEfectivo + this.totalBizum + this.totalTarjeta + this.totalTrasnf
      + this.totalTerap + this.totalEncarg + this.totalDriverTaxi

    if (this.totalCollection > 999)
      this.totalCollections = (this.totalCollection / 1000).toFixed(3)
    else
      this.totalCollections = this.totalCollection.toString()

    this.validateTheEmptyField()
  }

  backArrow = async () => {
    let fechHoy = new Date(), fechaEnd = '', convertDiaHoy = '', diaHoy = 0, mesHoy = 0,
      añoHoy = 0, convertMesHoy = ''

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()
    this.day = this.day - 1

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
          this.dateTodayCurrent = 'HOY'
        } else {
          this.dateTodayCurrent = `${this.day} de ${this.month}`
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.tableTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente, this.company).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.tableTherapistForManager(rp, 'arrow', fechaActualmente)

            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre'], this.company).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
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
          this.dateTodayCurrent = 'HOY'
        } else {
          this.dateTodayCurrent = `${this.day} de ${this.month}`
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.tableTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente, this.company).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.tableTherapistForManager(rp, 'arrow', fechaActualmente)

            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre'], this.company).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
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

    diaHoy = fechHoy.getDate()
    mesHoy = fechHoy.getMonth() + 1
    añoHoy = fechHoy.getFullYear()
    this.day = this.day + 1

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
          this.dateTodayCurrent = 'HOY'
        } else {
          this.dateTodayCurrent = `${this.day} de ${this.month}`
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.tableTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente, this.company).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.tableTherapistForManager(rp, 'arrow', fechaActualmente)

            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre'], this.company).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
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
          this.dateTodayCurrent = 'HOY'
        } else {
          this.dateTodayCurrent = `${this.day} de ${this.month}`
        }

        this.day = Number(convertDia)
        this.month = month

        fechaActualmente = `${convertAño}-${mes}-${convertDia}`

        this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
          if (rp[0]['rol'] == 'administrador') {

            await this.getManagerall(fechaActualmente)
            await this.tableTherapist('date', fechaActualmente)

            this.service.getFechaHoy(fechaActualmente, this.company).subscribe((rp: any) => {
              this.vision = rp
              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          } else {

            await this.getManager(rp, fechaActualmente, 'date')
            await this.tableTherapistForManager(rp, 'arrow', fechaActualmente)

            this.service.getEncargadaAndDate(fechaActualmente, rp[0]['nombre'], this.company).subscribe((rp: any) => {
              this.vision = rp

              if (rp.length > 0) this.totalVisionSum()
              else this.totalsAtZero()
            })
          }
        })

        this.siguienteCount = this.count
        return true
      }
    }
    return false
  }

  async editByName(nombre: string) {
    this.service.getTerapeutaWithCurrentDate(nombre).subscribe((rp: any) => {
      if (rp.length > 0) {
        this.serviceModel.pantalla = 'vision'
        this.service.updateScreenById(rp[0]['id'], this.serviceModel).subscribe(async (rp: any) => { })
        this.router.navigate([`tabs/${this.idUser}/edit-services/${rp[0]['id']}`])
      }
    })
  }

  menu() {
    this.router.navigate([`tabs/${this.idUser}/menu`])
  }

  selectTherap(name: string) {
    localStorage.clear()
    localStorage.setItem('terapeuta', name)
    this.router.navigate([`tabs/${this.idUser}/services`])
  }
}