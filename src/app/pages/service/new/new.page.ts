import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';
import { ModelService } from 'src/app/core/models/service';

// Services
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { ServiceService } from 'src/app/core/services/service/service.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})

export class NewPage implements OnInit {
  hourStartTerapeuta = ''
  horaEndTerapeuta = ''

  fechaActual = ''
  horaStarted = new Date().toTimeString().substring(0, 5)
  dateConvertion = new Date()
  fechaHoyInicio = ''
  currentDate = new Date().getTime()

  select: boolean = false

  terapeuta: any[] = []

  fechaLast = []
  manager: any
  administratorRole: boolean = false

  chageDate = ''
  formaPago: string = ''
  salidaTrabajador = ''

  horaInicialServicio: string
  servicioTotal = 0

  sumatoriaServicios = 0
  restamosCobro = 0
  sumatoriaCobros = 0

  // Cobros
  validateEfect = false
  validateBizum = false
  validateTarjeta = false
  validateTrans = false

  idUserAdministrador: number
  idUser: number
  buttonDelete = false

  idUnico: string

  terapeutaSelect: any
  Servminutes = ""
  buttonSave: any

  services: ModelService = {
    bebidas: "",
    bebidaTerap: "",
    bizuEncarg: false,
    bizuDriverTaxi: false,
    bizuPiso1: false,
    bizuPiso2: false,
    bizuTerap: false,
    cierre: false,
    cliente: "",
    currentDate: "",
    efectEncarg: false,
    efectDriverTaxi: false,
    efectPiso1: false,
    efectPiso2: false,
    efectTerap: false,
    encargada: "",
    fecha: "",
    fechaFin: "",
    fechaHoyInicio: "",
    formaPago: "",
    horaEnd: "",
    horaStart: "",
    id: 0,
    idCierre: "",
    idEncargada: "",
    idTerapeuta: "",
    idUnico: "",
    liquidadoEncargada: false,
    liquidadoTerapeuta: false,
    minuto: 0,
    nota: "",
    numberEncarg: "",
    numberTaxi: "",
    numberPiso1: "",
    numberPiso2: "",
    numberTerap: "",
    otros: "",
    propina: "",
    salida: "",
    servicio: "",
    tabaco: "",
    tarjEncarg: false,
    tarjDriverTaxi: false,
    tarjPiso1: false,
    tarjPiso2: false,
    tarjTerap: false,
    taxi: "",
    terapeuta: "",
    totalServicio: 0,
    transEncarg: false,
    transDriverTaxi: false,
    transPiso1: false,
    transPiso2: false,
    transTerap: false,
    valueBizuEncargada: 0,
    valueBizum: 0,
    valueBizuTerapeuta: 0,
    valueEfectEncargada: 0,
    valueEfectivo: 0,
    valueEfectTerapeuta: 0,
    valuePiso1Bizum: 0,
    valuePiso1Efectivo: 0,
    valuePiso1Tarjeta: 0,
    valuePiso1Transaccion: 0,
    valuePiso2Bizum: 0,
    valuePiso2Efectivo: 0,
    valuePiso2Tarjeta: 0,
    valuePiso2Transaccion: 0,
    valueTarjeEncargada: 0,
    valueTarjeta: 0,
    valueTarjeTerapeuta: 0,
    valueTrans: 0,
    valueTransEncargada: 0,
    valueTransTerapeuta: 0,
    vitaminas: "",
  }

  therapist: ModelTherapist = {
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

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private serviceServices: ServiceService,
    private ionLoaderService: IonLoaderService
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(params['id'])

    if (this.idUser) {
      this.serviceManager.getById(this.idUser).subscribe((rp) => {
        if (rp[0]['rol'] == 'administrador') {
          this.getManager()
        } else {
          this.manager = rp
          this.services.encargada = this.manager[0].nombre
        }
      })
    }

    this.getTherapist()
    this.getManager()
    this.date()

    this.horaInicialServicio = this.horaStarted
    this.services.horaEnd = this.horaStarted
    this.services.horaStart = this.horaStarted
  }

  showKeyBoard(text: string) {
    
    document.getElementById('overview').style.height = '4065px'

    if (text === 'date') {
      document.getElementById('box-date').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-date').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'
    }

    if (text === 'time') {
      document.getElementById('box-time').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-time').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'
    }

    if (text === 'duration') {
      document.getElementById('box-duration').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-duration').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('duration')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'treatment') {
      document.getElementById('box-treatment').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-treatment').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('treatment')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'taxi') {
      document.getElementById('box-taxi').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-taxi').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('taxi')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'tobacco') {
      document.getElementById('box-tobacco').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-tobacco').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('tobacco')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'drinkHouse') {
      document.getElementById('box-drinkHouse').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-drinkHouse').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('drinkHouse')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'tip') {
      document.getElementById('box-tip').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-tip').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('tip')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'vitamins') {
      document.getElementById('box-vitamins').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-vitamins').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('vitamins')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'others') {
      document.getElementById('box-others').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-others').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('others')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'drinkTherapist') {
      document.getElementById('box-drinkTherapist').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-drinkTherapist').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('drinkTherapist')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'house1') {
      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('house1')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 1100,
          behavior: "smooth"
        })
      }
    }

    if (text === 'house2') {
      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('house2')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 1200,
          behavior: "smooth"
        })
      }
    }

    if (text === 'therapist') {
      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('therapist')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 1400,
          behavior: "smooth"
        })
      }
    }

    if (text === 'manager') {
      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('manager')
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 352) {
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 1600,
          behavior: "smooth"
        })
      }
    }

    if (text === 'notes') {
      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.querySelector<HTMLElement>(".rectangle-77")
      var scrolling_parent = element_to_show.parentElement

      var top = parseInt(scrolling_parent.getBoundingClientRect().top.toString())

      var now_top = parseInt(element_to_show.getBoundingClientRect().top.toString())

      if (now_top > 335) {
        document.getElementById('overview').style.height = '4165px'
        var scroll_by = -(top - now_top)
        screen.scrollTo({
          top: scroll_by - now_top + 1800,
          behavior: "smooth"
        })
      }
    }
  }

  hideKeyBoard(text: string) {

    if (text === 'date') {
      document.getElementById('box-date').style.boxShadow = 'none'
      document.getElementById('box-date').style.borderColor = '#3c3c3c'
    }

    if (text === 'time') {
      document.getElementById('box-time').style.boxShadow = 'none'
      document.getElementById('box-time').style.borderColor = '#3c3c3c'
    }

    if (text === 'duration') {
      document.getElementById('box-duration').style.boxShadow = 'none'
      document.getElementById('box-duration').style.borderColor = '#3c3c3c'
    }

    if (text === 'treatment') {
      document.getElementById('box-treatment').style.boxShadow = 'none'
      document.getElementById('box-treatment').style.borderColor = '#3c3c3c'
    }

    if (text === 'taxi') {
      document.getElementById('box-taxi').style.boxShadow = 'none'
      document.getElementById('box-taxi').style.borderColor = '#3c3c3c'
    }

    if (text === 'tobacco') {
      document.getElementById('box-tobacco').style.boxShadow = 'none'
      document.getElementById('box-tobacco').style.borderColor = '#3c3c3c'
    }

    if (text === 'drinkHouse') {
      document.getElementById('box-drinkHouse').style.boxShadow = 'none'
      document.getElementById('box-drinkHouse').style.borderColor = '#3c3c3c'
    }

    if (text === 'tip') {
      document.getElementById('box-tip').style.boxShadow = 'none'
      document.getElementById('box-tip').style.borderColor = '#3c3c3c'
    }

    if (text === 'vitamins') {
      document.getElementById('box-vitamins').style.boxShadow = 'none'
      document.getElementById('box-vitamins').style.borderColor = '#3c3c3c'
    }

    if (text === 'others') {
      document.getElementById('box-others').style.boxShadow = 'none'
      document.getElementById('box-others').style.borderColor = '#3c3c3c'
    }

    if (text === 'drinkTherapist') {
      document.getElementById('box-drinkTherapist').style.boxShadow = 'none'
      document.getElementById('box-drinkTherapist').style.borderColor = '#3c3c3c'
    }

    if (text === 'notes') {
      document.getElementById('overview').style.height = '4065px'
    }
  }

  date() {
    let fecha = new Date(), dia = 0, mes = 0, año = 0, convertMes = '', convertDia = ''

    dia = fecha.getDate()
    mes = fecha.getMonth() + 1
    año = fecha.getFullYear()

    if (mes > 0 && mes < 10) {
      convertMes = '0' + mes
      this.fechaActual = `${año}-${convertMes}-${dia}`
    } else {
      convertMes = mes.toString()
      this.fechaActual = `${año}-${mes}-${dia}`
    }

    if (dia > 0 && dia < 10) {
      convertDia = '0' + dia
      this.fechaActual = `${año}-${convertMes}-${convertDia}`
    } else {
      convertDia = dia.toString()
      this.fechaActual = `${año}-${convertMes}-${dia}`
    }
  }

  sortedDate() {
    let dia = '', mes = '', año = '', currentDate = new Date()

    dia = this.fechaActual.substring(8, 10)
    mes = this.fechaActual.substring(5, 7)
    año = this.fechaActual.substring(2, 4)

    this.fechaActual = `${dia}-${mes}-${año}`
    this.services.fecha = this.fechaActual

    this.services.fechaHoyInicio = `${currentDate.getFullYear()}-${mes}-${dia}`
  }

  getLastDate() {
    this.serviceServices.getServicio().subscribe((datoLastDate: any) => {
      if (datoLastDate.length > 0) this.fechaLast[0] = datoLastDate[0]
      else this.fechaLast = datoLastDate['00:00']
    })
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5, 10)
  }

  expiredDateValidations() {
    this.buttonSave = document.getElementById('btnSave') as HTMLButtonElement
    this.buttonSave.disabled = true

    let currentHours, diferenceHour
    const splitDate = this.fechaActual.split('-')
    const selectDate = new Date(`${splitDate[1]}/${splitDate[2].slice(0, 2)}/${splitDate[0]}/${this.horaInicialServicio}`)
    const currentDate = new Date()
    const currentDateWithoutHours = new Date(`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)

    diferenceHour = (currentDate.getTime() - selectDate.getTime()) / 1000
    diferenceHour /= (60 * 60)

    currentHours = Math.abs(Math.round(diferenceHour))

    // const currentHours = currentDate.getHours()
    if (selectDate < currentDateWithoutHours || currentHours > 24) {
      this.buttonSave.disabled = false
      Swal.fire({
        heightAuto: false,
        position: 'top-end',
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede crear el servicio por la fecha.',
        showConfirmButton: false,
        timer: 2500,
      });
      return false
    }

    return true
  }

  createUniqueId() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.services.idUnico = uuid
    this.idUnico = uuid
    return this.idUnico
  }

  convertZero() {
    this.services.numberPiso1 = "0"
    this.services.numberPiso2 = "0"
    this.services.numberEncarg = "0"
    this.services.numberTerap = "0"
    this.services.numberTaxi = "0"
    this.services.servicio = "0"
    this.services.bebidas = "0"
    this.services.bebidaTerap = "0"
    this.services.tabaco = "0"
    this.services.taxi = "0"
    this.services.vitaminas = "0"
    this.services.propina = "0"
    this.services.otros = "0"
    this.services.totalServicio = 0
  }

  validateTheEmptyField() {
    if (this.services.bebidas == "") this.services.bebidas = "0"
    if (this.services.bebidaTerap == "") this.services.bebidaTerap = "0"
    if (this.services.numberEncarg == "") this.services.numberEncarg = "0"
    if (this.services.numberTaxi == "") this.services.numberTaxi = "0"
    if (this.services.numberPiso1 == "") this.services.numberPiso1 = "0"
    if (this.services.numberPiso2 == "") this.services.numberPiso2 = "0"
    if (this.services.numberTerap == "") this.services.numberTerap = "0"
    if (this.services.otros == "") this.services.otros = "0"
    if (this.services.propina == "") this.services.propina = "0"
    if (this.services.tabaco == "") this.services.tabaco = "0"
    if (this.services.taxi == "") this.services.taxi = "0"
    if (this.services.vitaminas == "") this.services.vitaminas = "0"
  }

  bizumFloor1() {
    if (document.getElementById('bizumHouse1').style.background == "") {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuPiso1 = true
    } else {
      document.getElementById('bizumHouse1').style.background = ""
      this.services.bizuPiso1 = false
    }

    this.validatePayment()
  }

  cardFloor1() {
    if (document.getElementById('cardHouse1').style.background == "") {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.tarjPiso1 = true
    } else {
      document.getElementById('cardHouse1').style.background = ""
      this.services.tarjPiso1 = false
    }

    this.validatePayment()
  }

  transFloor1() {
    if (document.getElementById('transHouse1').style.background == "") {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transPiso1 = true
    } else {
      document.getElementById('transHouse1').style.background = ""
      this.services.transPiso1 = false
    }

    this.validatePayment()
  }

  cashFloor1() {
    if (document.getElementById('cashHouse1').style.background == "") {
      document.getElementById('cashHouse1').style.background = '#1fb996'
      this.services.efectPiso1 = true
    } else {
      document.getElementById('cashHouse1').style.background = ""
      this.services.efectPiso1 = false
    }

    this.validatePayment()
  }

  bizumFloor2() {
    if (document.getElementById('bizumHouse2').style.background == "") {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuPiso2 = true
    } else {
      document.getElementById('bizumHouse2').style.background = ""
      this.services.bizuPiso2 = false
    }

    this.validatePayment()
  }

  cardFloor2() {
    if (document.getElementById('cardHouse2').style.background == "") {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.tarjPiso2 = true
    } else {
      document.getElementById('cardHouse2').style.background = ""
      this.services.tarjPiso2 = false
    }

    this.validatePayment()
  }

  transFloor2() {
    if (document.getElementById('transHouse2').style.background == "") {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transPiso2 = true
    } else {
      document.getElementById('transHouse2').style.background = ""
      this.services.transPiso2 = false
    }

    this.validatePayment()
  }

  cashFloor2() {
    if (document.getElementById('cashHouse2').style.background == "") {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.efectPiso2 = true
    } else {
      document.getElementById('cashHouse2').style.background = ""
      this.services.efectPiso2 = false
    }

    this.validatePayment()
  }

  bizumTherapist() {
    if (document.getElementById('bizumTherapist').style.background == "") {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTerap = true
    } else {
      document.getElementById('bizumTherapist').style.background = ""
      this.services.bizuTerap = false
    }

    this.validatePayment()
  }

  cardTherapist() {
    if (document.getElementById('cardTherapist').style.background == "") {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.tarjTerap = true
    } else {
      document.getElementById('cardTherapist').style.background = ""
      this.services.tarjTerap = false
    }

    this.validatePayment()
  }

  transTherapist() {
    if (document.getElementById('transTherapist').style.background == "") {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transTerap = true
    } else {
      document.getElementById('transTherapist').style.background = ""
      this.services.transTerap = false
    }

    this.validatePayment()
  }

  cashTherapist() {
    if (document.getElementById('cashTherapist').style.background == "") {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.efectTerap = true
    } else {
      document.getElementById('cashTherapist').style.background = ""
      this.services.efectTerap = false
    }

    this.validatePayment()
  }

  bizumManager() {
    if (document.getElementById('bizumManager').style.background == "") {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuEncarg = true
    } else {
      document.getElementById('bizumManager').style.background = ""
      this.services.bizuEncarg = false
    }

    this.validatePayment()
  }

  cardManager() {
    if (document.getElementById('cardManager').style.background == "") {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.tarjEncarg = true
    } else {
      document.getElementById('cardManager').style.background = ""
      this.services.tarjEncarg = false
    }

    this.validatePayment()
  }

  transManager() {
    if (document.getElementById('transManager').style.background == "") {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transEncarg = true
    } else {
      document.getElementById('transManager').style.background = ""
      this.services.transEncarg = false
    }

    this.validatePayment()
  }

  cashManager() {
    if (document.getElementById('cashManager').style.background == "") {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.efectEncarg = true
    } else {
      document.getElementById('cashManager').style.background = ""
      this.services.efectEncarg = false
    }

    this.validatePayment()
  }

  saveService() {
    this.buttonSave = document.getElementById('btnSave') as HTMLButtonElement
    this.buttonSave.disabled = true;
    if (this.services.terapeuta != '') {
      if (this.services.encargada != '') {
        if (Number(this.services.servicio) > 0) {
          if (this.services.minuto != 0) {
            if (this.sumatoriaCobros == this.sumatoriaServicios) {
              // Methods 
              this.createUniqueId()
              this.validateTheEmptyField()
              if (!this.expiredDateValidations()) return
              if (!this.paymentMethodValidation()) return
              if (!this.validatePaymentMethod()) return
              this.sumService()

              this.ionLoaderService.simpleLoader()

              if (this.services.efectPiso1 == true || this.services.efectPiso2 == true ||
                this.services.efectTerap == true || this.services.efectEncarg == true ||
                this.services.efectDriverTaxi == true) {
                this.validateEfect = true
                this.efectCheckToggle(this.validateEfect)
              } else {
                localStorage.removeItem('Efectivo')
              }

              if (this.services.bizuPiso1 == true || this.services.bizuPiso2 == true ||
                this.services.bizuTerap == true || this.services.bizuEncarg == true ||
                this.services.bizuDriverTaxi == true) {
                this.validateBizum = true
                this.bizumCheckToggle(this.validateBizum)
              } else {
                localStorage.removeItem('Bizum')
              }

              if (this.services.tarjPiso1 == true || this.services.tarjPiso2 == true ||
                this.services.tarjTerap == true || this.services.tarjEncarg == true ||
                this.services.tarjDriverTaxi == true) {
                this.validateTarjeta = true
                this.tarjCheckToggle(this.validateTarjeta)
              } else {
                localStorage.removeItem('Tarjeta')
              }

              if (this.services.transPiso1 == true || this.services.transPiso2 == true ||
                this.services.transTerap == true || this.services.transEncarg == true ||
                this.services.transDriverTaxi == true) {
                this.validateTrans = true
                this.transCheckToggle(this.validateTrans)
              } else {
                localStorage.removeItem('Trans')
              }

              this.wayToPay()
              this.managerAndTherapist()

              this.services.currentDate = this.currentDate.toString()

              this.sortedDate()
              this.services.editar = true

              this.therapist.horaEnd = this.services.horaEnd
              this.therapist.salida = this.services.salida
              this.therapist.fechaEnd = this.services.fechaFin
              this.therapist.minuto = this.services.minuto

              this.serviceTherapist.update(this.services.terapeuta, this.therapist).subscribe((rp: any) => { })

              this.serviceServices.registerServicio(this.services).subscribe((rp: any) => {
                if (rp) {
                  localStorage.removeItem('Efectivo')
                  localStorage.removeItem('Bizum')
                  localStorage.removeItem('Tarjeta')
                  localStorage.removeItem('Trans')
                  setTimeout(() => {
                    this.ionLoaderService.dismissLoader()
                    location.replace(`tabs/${this.idUser}/vision`)
                    Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1500 })
                  }, 1000)
                }
              })
            }
            else {
              this.buttonSave.disabled = false
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
            }
          } else {
            this.buttonSave.disabled = false
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo minutos se encuentra vacio', showConfirmButton: false, timer: 2500 })
          }
        } else {
          this.buttonSave.disabled = false
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'El campo tratamiento se encuentra vacio', showConfirmButton: false, timer: 2500 })
        }
      } else {
        this.buttonSave.disabled = false
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
      }
    } else {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No hay ninguna terapeuta seleccionada', showConfirmButton: false, timer: 2500 })
    }
  }

  sumService() {
    this.services.totalServicio = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) +
      Number(this.services.numberTerap) + Number(this.services.numberEncarg) + Number(this.services.numberTaxi)
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.efectPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
        this.services.valuePiso1Efectivo = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.efectPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
        this.services.valuePiso2Efectivo = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.efectTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.efectEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.efectDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueEfectivo = suma
      localStorage.setItem('Efectivo', 'Efectivo')
      return
    }
  }

  bizumCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.bizuPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
        this.services.valuePiso1Bizum = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.bizuPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
        this.services.valuePiso2Bizum = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.bizuTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.bizuEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.bizuDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueBizum = suma
      localStorage.setItem('Bizum', 'Bizum')
      return
    }
  }

  tarjCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberPiso1) > 0 && this.services.tarjPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
        this.services.valuePiso1Tarjeta = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.tarjPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
        this.services.valuePiso2Tarjeta = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.tarjTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.tarjEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.tarjDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueTarjeta = suma
      localStorage.setItem('Tarjeta', 'Tarjeta')
      return
    }
  }

  transCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validatePaymentMethod()) return

    if (event) {
      if (Number(this.services.numberPiso1) > 0 && this.services.transPiso1 == true) {
        piso1 = Number(this.services.numberPiso1)
        this.services.valuePiso1Transaccion = Number(this.services.numberPiso1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberPiso2) > 0 && this.services.transPiso2 == true) {
        piso2 = Number(this.services.numberPiso2)
        this.services.valuePiso2Transaccion = Number(this.services.numberPiso2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTerap) > 0 && this.services.transTerap == true) {
        terap = Number(this.services.numberTerap)
      } else {
        terap = 0
      }

      if (Number(this.services.numberEncarg) > 0 && this.services.transEncarg == true) {
        terap = Number(this.services.numberEncarg)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.transDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueTrans = suma
      localStorage.setItem('Trans', 'Trans')
      return
    }
  }

  wayToPay(): void {
    const formPago = []
    if (localStorage.getItem('Efectivo')) {
      formPago.push('Efectivo')
    }
    if (localStorage.getItem('Bizum')) {
      formPago.push('Bizum')
    }
    if (localStorage.getItem('Tarjeta')) {
      formPago.push('Tarjeta')
    }
    if (localStorage.getItem('Trans')) {
      formPago.push('Trans')
    }

    this.services.formaPago = formPago.join(',')
  }

  startTime(event: any) {
    this.services.horaEnd = event.target.value.toString()
    this.horaInicialServicio = event.target.value.toString()

    if (Number(this.services.minuto) > 0) {
      let sumarsesion = Number(this.services.minuto), horas = 0, minutos = 0, convertHora = ''

      // Create date by Date and Hour
      const splitDate = this.fechaActual.toString().split('-')
      const splitHour = this.horaInicialServicio.split(':')

      let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

      defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

      horas = defineDate.getHours()
      minutos = defineDate.getMinutes()

      if (horas > 0 && horas < 10) {
        convertHora = '0' + horas
        let hora = convertHora
        let minutes = minutos
        this.services.horaEnd = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.services.horaEnd = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }
  }

  chosenDate(event: any) {
    this.fechaActual = event.target.value
  }

  minutes(event: any) {
    this.services.minuto = Number(event.value)
    let sumarsesion = Number(event.value), horas = 0, minutos = 0, convertHora = '', day = '', month = '', year = ''
    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.horaInicialServicio.split(':')

    let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))
    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

    let datesEnd = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))
    datesEnd.setMinutes(datesEnd.getMinutes() + sumarsesion)

    day = datesEnd.toString().substring(8, 10)
    month = datesEnd.toString().substring(4, 7)
    year = datesEnd.toString().substring(13, 15)

    if (month == 'Dec') month = "12"
    if (month == 'Nov') month = "11"
    if (month == 'Oct') month = "10"
    if (month == 'Sep') month = "09"
    if (month == 'Aug') month = "08"
    if (month == 'Jul') month = "07"
    if (month == 'Jun') month = "06"
    if (month == 'May') month = "05"
    if (month == 'Apr') month = "04"
    if (month == 'Mar') month = "03"
    if (month == 'Feb') month = "02"
    if (month == 'Jan') month = "01"

    this.services.fechaFin = `${day}-${month}-${year}`

    horas = defineDate.getHours()
    minutos = defineDate.getMinutes()

    if (horas >= 0 && horas < 10) {
      convertHora = '0' + horas
      let hora = convertHora
      let minutes = minutos
      this.services.horaEnd = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    } else {
      let minutes = minutos
      this.services.horaEnd = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
    }
  }

  serviceValue() {

    let restamos = 0

    this.sumatoriaServicios = Number(this.services.servicio) + Number(this.services.propina) + Number(this.services.taxi) +
      Number(this.services.bebidas) + Number(this.services.bebidaTerap) + Number(this.services.tabaco) +
      Number(this.services.vitaminas) + Number(this.services.otros)

    restamos = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) + Number(this.services.numberTerap) +
      Number(this.services.numberEncarg) + Number(this.services.numberTaxi)

    if (Number(this.services.numberPiso1) > 0 || this.services.numberPiso1 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberPiso2) > 0 || this.services.numberPiso2 != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberTerap) > 0 || this.services.numberTerap != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberEncarg) > 0 || this.services.numberEncarg != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberTaxi) > 0 || this.services.numberTaxi != '') {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (this.sumatoriaServicios != 0) {
      this.services.numberPiso1 = this.sumatoriaServicios.toString()
      this.collectionsValue()
    }
  }

  collectionsValue() {
    let resultado = 0

    this.sumatoriaCobros = Number(this.services.numberPiso1) + Number(this.services.numberPiso2) +
      Number(this.services.numberTerap) + Number(this.services.numberEncarg) + Number(this.services.numberTaxi)

    resultado = this.sumatoriaServicios - this.sumatoriaCobros
    this.restamosCobro = resultado
  }

  therapists(event: any) {
    this.getLastDate()

    this.serviceServices.getTerapeutaByDesc(event).subscribe((rp: any) => {
      if (rp.length > 0) {
        this.hourStartTerapeuta = rp[0]['horaStart']
        this.horaEndTerapeuta = rp[0]['horaEnd']
      }
      else {
        this.hourStartTerapeuta = ''
        this.horaEndTerapeuta = ''
      }
    })
  }

  managerAndTherapist() {

    // Terapeuta
    if (this.services.efectTerap == true && Number(this.services.numberTerap) > 0) this.services.valueEfectTerapeuta = Number(this.services.numberTerap)
    if (this.services.bizuTerap == true && Number(this.services.numberTerap) > 0) this.services.valueBizuTerapeuta = Number(this.services.numberTerap)
    if (this.services.tarjTerap == true && Number(this.services.numberTerap) > 0) this.services.valueTarjeTerapeuta = Number(this.services.numberTerap)
    if (this.services.transTerap == true && Number(this.services.numberTerap) > 0) this.services.valueTransTerapeuta = Number(this.services.numberTerap)

    // Encargada
    if (this.services.efectEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueEfectEncargada = Number(this.services.numberEncarg)
    if (this.services.bizuEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueBizuEncargada = Number(this.services.numberEncarg)
    if (this.services.tarjEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueTarjeEncargada = Number(this.services.numberEncarg)
    if (this.services.transEncarg == true && Number(this.services.numberEncarg) > 0) this.services.valueTransEncargada = Number(this.services.numberEncarg)
  }

  validatePaymentMethod() {

    // Efectivo
    if (this.services.efectPiso1 == true && this.services.bizuPiso1 == true || this.services.efectPiso2 == true &&
      this.services.bizuPiso2 == true || this.services.efectTerap == true && this.services.bizuTerap == true ||
      this.services.efectEncarg == true && this.services.bizuEncarg == true || this.services.efectDriverTaxi == true &&
      this.services.bizuDriverTaxi == true || this.services.efectPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.efectPiso2 == true && this.services.tarjPiso2 == true || this.services.efectTerap == true &&
      this.services.tarjTerap == true || this.services.efectEncarg == true && this.services.tarjEncarg == true ||
      this.services.efectDriverTaxi == true && this.services.tarjDriverTaxi == true || this.services.efectPiso1 == true &&
      this.services.transPiso1 == true || this.services.efectPiso2 == true && this.services.transPiso2 == true ||
      this.services.efectTerap == true && this.services.transTerap == true || this.services.efectEncarg == true &&
      this.services.transEncarg == true || this.services.efectDriverTaxi == true && this.services.transDriverTaxi == true) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (this.services.bizuPiso1 == true && this.services.efectPiso1 == true || this.services.bizuPiso2 == true &&
      this.services.efectPiso2 == true || this.services.bizuTerap == true && this.services.efectTerap == true ||
      this.services.bizuEncarg == true && this.services.efectEncarg == true || this.services.bizuDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.bizuPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.bizuPiso2 == true && this.services.tarjPiso2 == true || this.services.bizuTerap == true &&
      this.services.tarjTerap == true || this.services.bizuEncarg == true && this.services.tarjEncarg == true ||
      this.services.bizuDriverTaxi == true && this.services.tarjDriverTaxi == true || this.services.bizuPiso1 == true &&
      this.services.transPiso1 == true || this.services.bizuPiso2 == true && this.services.transPiso2 == true ||
      this.services.bizuTerap == true && this.services.transTerap == true || this.services.bizuEncarg == true &&
      this.services.transEncarg == true || this.services.bizuDriverTaxi == true && this.services.transDriverTaxi == true) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (this.services.tarjPiso1 == true && this.services.efectPiso1 == true || this.services.tarjPiso2 == true &&
      this.services.efectPiso2 == true || this.services.tarjTerap == true && this.services.efectTerap == true ||
      this.services.tarjEncarg == true && this.services.efectEncarg == true || this.services.tarjDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.tarjPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.tarjPiso2 == true && this.services.bizuPiso2 == true || this.services.tarjTerap == true &&
      this.services.bizuTerap == true || this.services.tarjEncarg == true && this.services.bizuEncarg == true ||
      this.services.tarjDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.tarjPiso1 == true &&
      this.services.transPiso1 == true || this.services.tarjPiso2 == true && this.services.transPiso2 == true ||
      this.services.tarjTerap == true && this.services.transTerap == true || this.services.tarjEncarg == true &&
      this.services.transEncarg == true || this.services.tarjDriverTaxi == true && this.services.transDriverTaxi == true) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (this.services.transPiso1 == true && this.services.efectPiso1 == true || this.services.transPiso2 == true &&
      this.services.efectPiso2 == true || this.services.transTerap == true && this.services.efectTerap == true ||
      this.services.transEncarg == true && this.services.efectEncarg == true || this.services.transDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.transPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.transPiso2 == true && this.services.bizuPiso2 == true || this.services.transTerap == true &&
      this.services.bizuTerap == true || this.services.transEncarg == true && this.services.bizuEncarg == true ||
      this.services.transDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.transPiso1 == true &&
      this.services.tarjPiso1 == true || this.services.transPiso2 == true && this.services.tarjPiso2 == true ||
      this.services.transTerap == true && this.services.tarjTerap == true || this.services.transEncarg == true &&
      this.services.tarjEncarg == true || this.services.transDriverTaxi == true && this.services.tarjDriverTaxi == true) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validatePayment() {

    // Efectivo
    if (this.services.efectPiso1 == true && this.services.bizuPiso1 == true || this.services.efectPiso2 == true &&
      this.services.bizuPiso2 == true || this.services.efectTerap == true && this.services.bizuTerap == true ||
      this.services.efectEncarg == true && this.services.bizuEncarg == true || this.services.efectDriverTaxi == true &&
      this.services.bizuDriverTaxi == true || this.services.efectPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.efectPiso2 == true && this.services.tarjPiso2 == true || this.services.efectTerap == true &&
      this.services.tarjTerap == true || this.services.efectEncarg == true && this.services.tarjEncarg == true ||
      this.services.efectDriverTaxi == true && this.services.tarjDriverTaxi == true || this.services.efectPiso1 == true &&
      this.services.transPiso1 == true || this.services.efectPiso2 == true && this.services.transPiso2 == true ||
      this.services.efectTerap == true && this.services.transTerap == true || this.services.efectEncarg == true &&
      this.services.transEncarg == true || this.services.efectDriverTaxi == true && this.services.transDriverTaxi == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (this.services.bizuPiso1 == true && this.services.efectPiso1 == true || this.services.bizuPiso2 == true &&
      this.services.efectPiso2 == true || this.services.bizuTerap == true && this.services.efectTerap == true ||
      this.services.bizuEncarg == true && this.services.efectEncarg == true || this.services.bizuDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.bizuPiso1 == true && this.services.tarjPiso1 == true ||
      this.services.bizuPiso2 == true && this.services.tarjPiso2 == true || this.services.bizuTerap == true &&
      this.services.tarjTerap == true || this.services.bizuEncarg == true && this.services.tarjEncarg == true ||
      this.services.bizuDriverTaxi == true && this.services.tarjDriverTaxi == true || this.services.bizuPiso1 == true &&
      this.services.transPiso1 == true || this.services.bizuPiso2 == true && this.services.transPiso2 == true ||
      this.services.bizuTerap == true && this.services.transTerap == true || this.services.bizuEncarg == true &&
      this.services.transEncarg == true || this.services.bizuDriverTaxi == true && this.services.transDriverTaxi == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (this.services.tarjPiso1 == true && this.services.efectPiso1 == true || this.services.tarjPiso2 == true &&
      this.services.efectPiso2 == true || this.services.tarjTerap == true && this.services.efectTerap == true ||
      this.services.tarjEncarg == true && this.services.efectEncarg == true || this.services.tarjDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.tarjPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.tarjPiso2 == true && this.services.bizuPiso2 == true || this.services.tarjTerap == true &&
      this.services.bizuTerap == true || this.services.tarjEncarg == true && this.services.bizuEncarg == true ||
      this.services.tarjDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.tarjPiso1 == true &&
      this.services.transPiso1 == true || this.services.tarjPiso2 == true && this.services.transPiso2 == true ||
      this.services.tarjTerap == true && this.services.transTerap == true || this.services.tarjEncarg == true &&
      this.services.transEncarg == true || this.services.tarjDriverTaxi == true && this.services.transDriverTaxi == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (this.services.transPiso1 == true && this.services.efectPiso1 == true || this.services.transPiso2 == true &&
      this.services.efectPiso2 == true || this.services.transTerap == true && this.services.efectTerap == true ||
      this.services.transEncarg == true && this.services.efectEncarg == true || this.services.transDriverTaxi == true &&
      this.services.efectDriverTaxi == true || this.services.transPiso1 == true && this.services.bizuPiso1 == true ||
      this.services.transPiso2 == true && this.services.bizuPiso2 == true || this.services.transTerap == true &&
      this.services.bizuTerap == true || this.services.transEncarg == true && this.services.bizuEncarg == true ||
      this.services.transDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.transPiso1 == true &&
      this.services.tarjPiso1 == true || this.services.transPiso2 == true && this.services.tarjPiso2 == true ||
      this.services.transTerap == true && this.services.tarjTerap == true || this.services.transEncarg == true &&
      this.services.tarjEncarg == true || this.services.transDriverTaxi == true && this.services.tarjDriverTaxi == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  paymentMethodValidation() {
    if (Number(this.services.numberPiso1) > 0 && this.services.efectPiso1 == false && this.services.bizuPiso1 == false &&
      this.services.tarjPiso1 == false && this.services.transPiso1 == false) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.services.numberPiso2) > 0 && this.services.efectPiso2 == false && this.services.bizuPiso2 == false &&
      this.services.tarjPiso2 == false && this.services.transPiso2 == false) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.services.numberTerap) > 0 && this.services.efectTerap == false && this.services.bizuTerap == false &&
      this.services.tarjTerap == false && this.services.transTerap == false) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.services.numberEncarg) > 0 && this.services.efectEncarg == false && this.services.bizuEncarg == false &&
      this.services.tarjEncarg == false && this.services.transEncarg == false) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.services.numberTaxi) > 0 && this.services.efectDriverTaxi == false && this.services.bizuDriverTaxi == false &&
      this.services.tarjDriverTaxi == false && this.services.transDriverTaxi == false) {
      this.buttonSave.disabled = false
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para taxista' })
      return false
    }
    return true
  }

  selectTerap(name: string) {
    this.getLastDate()

    this.serviceServices.getTerapeutaByDesc(name).subscribe((rp: any) => {
      if (rp.length > 0) {
        this.hourStartTerapeuta = rp[0]['horaStart']
        this.horaEndTerapeuta = rp[0]['horaEnd']
      }
      else {
        this.hourStartTerapeuta = ''
        this.horaEndTerapeuta = ''
      }
    })
  }

  cancel() {
    localStorage.removeItem('Efectivo')
    localStorage.removeItem('Bizum')
    localStorage.removeItem('Tarjeta')
    localStorage.removeItem('Trans')
    location.replace(`tabs/${this.idUser}/vision`);
  }
}