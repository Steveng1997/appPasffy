import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import Swal from 'sweetalert2';
import dayjs from "dayjs";

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
  hourEnd = ''
  hourStart = ''

  dateToday = dayjs().format("YYYY-MM-DD")
  fechaActual = dayjs().format("YYYY-MM-DD HH:mm")
  horaStarted = dayjs().format("HH:mm")
  dateConvertion = new Date()
  fechaHoyInicio = ''
  currentDate = new Date().getTime()

  select: boolean = false

  terapeuta: any[] = []

  fechaLast = []
  manager: any
  administratorRole: boolean = false
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
    bizuManager: false,
    bizuDriverTaxi: false,
    bizuFloor1: false,
    bizuFloor2: false,
    bizuTherapist: false,
    cardManager: false,
    cardDriverTaxi: false,
    cardFloor1: false,
    cardFloor2: false,
    cardTherapist: false,
    cashManager: false,
    cashDriverTaxi: false,
    cashFloor1: false,
    cashFloor2: false,
    cashTherapist: false,
    closing: false,
    client: "",
    company: "",
    createdBy: "",
    currentDate: 0,
    dateStart: dayjs().format("YYYY-MM-DD HH:mm"),
    dateEnd: dayjs().format("YYYY-MM-DD HH:mm"),
    dateToday: dayjs().format("YYYY-MM-DD HH:mm"),
    drink: 0,
    drinkTherapist: 0,
    edit: false,
    exit: "",
    idClosing: "",
    idManag: "",
    idTherap: "",
    liquidatedManager: false,
    liquidatedTherapist: false,
    manager: "",
    minutes: 0,
    modifiedBy: "",
    note: "",
    numberManager: 0,
    numberTaxi: 0,
    numberFloor1: 0,
    numberFloor2: 0,
    numberTherapist: 0,
    others: 0,
    payment: "",
    screen: "",
    service: 0,
    tabacco: 0,
    taxi: 0,
    therapist: "",
    tip: 0,
    totalService: 0,
    transactionManager: false,
    transactionDriverTaxi: false,
    transactionFloor1: false,
    transactionFloor2: false,
    transactionTherapist: false,
    uniqueId: "",
    valueBizuManager: 0,
    valueBizuTherapist: 0,
    valueBizum: 0,
    valueEfectManager: 0,
    valueEfectTherapist: 0,
    valueCash: 0,
    valueFloor1Bizum: 0,
    valueFloor1Cash: 0,
    valueFloor1Card: 0,
    valueFloor1Transaction: 0,
    valueFloor2Bizum: 0,
    valueFloor2Cash: 0,
    valueFloor2Card: 0,
    valueFloor2Transaction: 0,
    valueCardManager: 0,
    valueCardTherapist: 0,
    valueCard: 0,
    valueTransaction: 0,
    valueTransactionManager: 0,
    valueTransactionTherapist: 0,
    vitamin: 0
  }

  therapist: ModelTherapist = {
    active: true,
    company: "",
    dateEnd: dayjs().format("YYYY-MM-DD HH:mm"),
    drink: 0,
    drinkTherapist: 0,
    exit: "",
    minutes: 0,
    name: "",
    others: 0,
    service: 0,
    tabacco: 0,
    tip: 0,
    vitamin: 0
  }

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private serviceServices: ServiceService,
    private ionLoaderService: IonLoaderService,
    private toastController: ToastController
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(params['id'])

    if (this.idUser) {
      this.serviceManager.getId(this.idUser).subscribe((rp) => {
        this.created(rp['manager'])
        if (rp['manager'].rol == 'Administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.administratorRole = false
          this.manager = rp
          this.services.manager = this.manager[0].nombre
        }
      })
    }

    this.getTherapist()
    this.getManager()

    this.horaInicialServicio = this.horaStarted
    this.hourEnd = this.horaStarted
    this.hourStart = this.horaStarted
  }

  created(rp: any) {
    this.services.createdBy = rp.name
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

    if (text === 'tabacco') {
      document.getElementById('box-tobacco').style.boxShadow = '0px 0px 0px 2px var(--verde, #1fb996)'
      document.getElementById('box-tobacco').style.borderColor = '0px 0px 0px 2px var(--verde, #1fb996)'

      var screen = document.querySelector<HTMLElement>(".nuevo-servicio")
      var element_to_show = document.getElementById('tabacco')
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

  getLastDate() {
    this.serviceServices.getService().subscribe((datoLastDate: any) => {
      if (datoLastDate.length > 0) this.fechaLast[0] = datoLastDate[0]
      else this.fechaLast = datoLastDate['00:00']
    })
  }

  getTherapist() {
    this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
      this.serviceTherapist.company(rp['manager'].company).subscribe((rp: any) => {
        this.terapeuta = rp['therapist']
      })
    })
  }

  getManager() {
    this.serviceManager.getId(this.idUser).subscribe(async (rp: any) => {
      this.services.company = rp['manager'].company
      this.serviceManager.company(this.services.company).subscribe((rp: any) => {
        this.manager = rp['manager']
      })
    })
  }

  expiredDateValidations() {
    let currentHours, diferenceHour
    let dateToday = dayjs().format("DD-MM-YY")
    const splitDate = dateToday.split('-')
    const selectDate = new Date(`${splitDate[1]}/${splitDate[0]}/${splitDate[2]}/${this.horaInicialServicio}`)
    const currentDate = new Date()
    const currentDateWithoutHours = new Date(`${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`)
    diferenceHour = (currentDate.getTime() - selectDate.getTime()) / 1000
    diferenceHour /= (60 * 60)
    currentHours = Math.abs(Math.round(diferenceHour))

    if (selectDate < currentDateWithoutHours || currentHours > 24 && this.administratorRole == false) {
      this.presentController('No se puede crear el servicio por la fecha.')
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

    this.services.uniqueId = uuid
    this.idUnico = uuid
    return this.idUnico
  }

  convertZero() {
    this.services.numberFloor1 = 0
    this.services.numberFloor2 = 0
    this.services.numberManager = 0
    this.services.numberTherapist = 0
    this.services.numberTaxi = 0
    this.services.service = 0
    this.services.drink = 0
    this.services.drinkTherapist = 0
    this.services.tabacco = 0
    this.services.taxi = 0
    this.services.vitamin = 0
    this.services.tip = 0
    this.services.others = 0
    this.services.totalService = 0
  }

  bizumFloor1() {
    if (document.getElementById('bizumHouse1').style.background == "") {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuFloor1 = true
    } else {
      document.getElementById('bizumHouse1').style.background = ""
      this.services.bizuFloor1 = false
    }

    this.validatePayment()
  }

  cardFloor1() {
    if (document.getElementById('cardHouse1').style.background == "") {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.cardFloor1 = true
    } else {
      document.getElementById('cardHouse1').style.background = ""
      this.services.cardFloor1 = false
    }

    this.validatePayment()
  }

  transFloor1() {
    if (document.getElementById('transHouse1').style.background == "") {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transactionFloor1 = true
    } else {
      document.getElementById('transHouse1').style.background = ""
      this.services.transactionFloor1 = false
    }

    this.validatePayment()
  }

  cashFloor1() {
    if (document.getElementById('cashHouse1').style.background == "") {
      document.getElementById('cashHouse1').style.background = '#1fb996'
      this.services.cashFloor1 = true
    } else {
      document.getElementById('cashHouse1').style.background = ""
      this.services.cashFloor1 = false
    }

    this.validatePayment()
  }

  bizumFloor2() {
    if (document.getElementById('bizumHouse2').style.background == "") {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuFloor2 = true
    } else {
      document.getElementById('bizumHouse2').style.background = ""
      this.services.bizuFloor2 = false
    }

    this.validatePayment()
  }

  cardFloor2() {
    if (document.getElementById('cardHouse2').style.background == "") {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.cardFloor2 = true
    } else {
      document.getElementById('cardHouse2').style.background = ""
      this.services.cardFloor2 = false
    }

    this.validatePayment()
  }

  transFloor2() {
    if (document.getElementById('transHouse2').style.background == "") {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transactionFloor2 = true
    } else {
      document.getElementById('transHouse2').style.background = ""
      this.services.transactionFloor2 = false
    }

    this.validatePayment()
  }

  cashFloor2() {
    if (document.getElementById('cashHouse2').style.background == "") {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.cashFloor2 = true
    } else {
      document.getElementById('cashHouse2').style.background = ""
      this.services.cashFloor2 = false
    }

    this.validatePayment()
  }

  bizumTherapist() {
    if (document.getElementById('bizumTherapist').style.background == "") {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTherapist = true
    } else {
      document.getElementById('bizumTherapist').style.background = ""
      this.services.bizuTherapist = false
    }

    this.validatePayment()
  }

  cardTherapist() {
    if (document.getElementById('cardTherapist').style.background == "") {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.cardTherapist = true
    } else {
      document.getElementById('cardTherapist').style.background = ""
      this.services.cardTherapist = false
    }

    this.validatePayment()
  }

  transTherapist() {
    if (document.getElementById('transTherapist').style.background == "") {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transactionTherapist = true
    } else {
      document.getElementById('transTherapist').style.background = ""
      this.services.transactionTherapist = false
    }

    this.validatePayment()
  }

  cashTherapist() {
    if (document.getElementById('cashTherapist').style.background == "") {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.cashTherapist = true
    } else {
      document.getElementById('cashTherapist').style.background = ""
      this.services.cashTherapist = false
    }

    this.validatePayment()
  }

  bizumManager() {
    if (document.getElementById('bizumManager').style.background == "") {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuManager = true
    } else {
      document.getElementById('bizumManager').style.background = ""
      this.services.bizuManager = false
    }

    this.validatePayment()
  }

  cardManager() {
    if (document.getElementById('cardManager').style.background == "") {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.cardManager = true
    } else {
      document.getElementById('cardManager').style.background = ""
      this.services.cardManager = false
    }

    this.validatePayment()
  }

  transManager() {
    if (document.getElementById('transManager').style.background == "") {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transactionManager = true
    } else {
      document.getElementById('transManager').style.background = ""
      this.services.transactionManager = false
    }

    this.validatePayment()
  }

  cashManager() {
    if (document.getElementById('cashManager').style.background == "") {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.cashManager = true
    } else {
      document.getElementById('cashManager').style.background = ""
      this.services.cashManager = false
    }

    this.validatePayment()
  }

  saveService() {
    if (this.services.therapist != '') {
      if (this.services.manager != '') {
        if (Number(this.services.service) > 0) {
          if (this.services.minutes != 0) {
            if (this.sumatoriaCobros == this.sumatoriaServicios) {
              this.createUniqueId()
              if (!this.expiredDateValidations()) return
              if (!this.paymentMethodValidation()) return
              if (!this.validatePaymentMethod()) return
              this.sumService()

              this.ionLoaderService.simpleLoader()

              if (this.services.cashFloor1 == true || this.services.cashFloor2 == true ||
                this.services.cashTherapist == true || this.services.cashManager == true ||
                this.services.cashDriverTaxi == true) {
                this.validateEfect = true
                this.efectCheckToggle(this.validateEfect)
              } else {
                localStorage.removeItem('Efectivo')
              }

              if (this.services.bizuFloor1 == true || this.services.bizuFloor2 == true ||
                this.services.bizuTherapist == true || this.services.bizuManager == true ||
                this.services.bizuDriverTaxi == true) {
                this.validateBizum = true
                this.bizumCheckToggle(this.validateBizum)
              } else {
                localStorage.removeItem('Bizum')
              }

              if (this.services.cardFloor1 == true || this.services.cardFloor2 == true ||
                this.services.cardTherapist == true || this.services.cardManager == true ||
                this.services.cardDriverTaxi == true) {
                this.validateTarjeta = true
                this.tarjCheckToggle(this.validateTarjeta)
              } else {
                localStorage.removeItem('Tarjeta')
              }

              if (this.services.transactionFloor1 == true || this.services.transactionFloor2 == true ||
                this.services.transactionTherapist == true || this.services.transactionManager == true ||
                this.services.transactionDriverTaxi == true) {
                this.validateTrans = true
                this.transCheckToggle(this.validateTrans)
              } else {
                localStorage.removeItem('Trans')
              }

              this.wayToPay()
              this.managerAndTherapist()

              this.services.currentDate = this.currentDate
              this.services.edit = true

              this.therapist.dateEnd = this.services.dateEnd
              this.therapist.exit = this.services.exit
              this.therapist.minutes = this.services.minutes

              this.serviceTherapist.update3Item(this.services.therapist, this.therapist).subscribe((rp: any) => { })
              this.serviceServices.save(this.services).subscribe((rp: any) => {
                if (rp) {
                  this.presentController('¡Insertado Correctamente!')
                  localStorage.removeItem('Efectivo')
                  localStorage.removeItem('Bizum')
                  localStorage.removeItem('Tarjeta')
                  localStorage.removeItem('Trans')
                  setTimeout(() => {
                    this.ionLoaderService.dismissLoader()
                    location.replace(`tabs/${this.idUser}/vision`)
                  }, 1000)
                }
              })
            }
            else {
              this.presentController('El total servicio no coincide con el total de cobros')
            }
          } else {
            this.presentController('El campo minutos se encuentra vacio')
          }
        } else {
          this.presentController('El campo tratamiento se encuentra vacio')
        }
      } else {
        this.presentController('No hay ninguna encargada seleccionada')
      }
    } else {
      this.presentController('No hay ninguna terapeuta seleccionada')
    }
  }

  sumService() {
    this.services.totalService = Number(this.services.numberFloor1) + Number(this.services.numberFloor2) +
      Number(this.services.numberTherapist) + Number(this.services.numberManager) + Number(this.services.numberTaxi)
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberFloor1) > 0 && this.services.cashFloor1 == true) {
        piso1 = Number(this.services.numberFloor1)
        this.services.valueFloor1Cash = Number(this.services.numberFloor1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberFloor2) > 0 && this.services.cashFloor2 == true) {
        piso2 = Number(this.services.numberFloor2)
        this.services.valueFloor2Cash = Number(this.services.numberFloor2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTherapist) > 0 && this.services.cashTherapist == true) {
        terap = Number(this.services.numberTherapist)
      } else {
        terap = 0
      }

      if (Number(this.services.numberManager) > 0 && this.services.cashManager == true) {
        terap = Number(this.services.numberManager)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.cashDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueCash = suma
      localStorage.setItem('Efectivo', 'Efectivo')
      return
    }
  }

  bizumCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0
    if (!this.validatePaymentMethod()) return

    if (event) {

      if (Number(this.services.numberFloor1) > 0 && this.services.bizuFloor1 == true) {
        piso1 = Number(this.services.numberFloor1)
        this.services.valueFloor1Bizum = Number(this.services.numberFloor1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberFloor2) > 0 && this.services.bizuFloor2 == true) {
        piso2 = Number(this.services.numberFloor2)
        this.services.valueFloor2Bizum = Number(this.services.numberFloor2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTherapist) > 0 && this.services.bizuTherapist == true) {
        terap = Number(this.services.numberTherapist)
      } else {
        terap = 0
      }

      if (Number(this.services.numberManager) > 0 && this.services.bizuManager == true) {
        terap = Number(this.services.numberManager)
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

      if (Number(this.services.numberFloor1) > 0 && this.services.cardFloor1 == true) {
        piso1 = Number(this.services.numberFloor1)
        this.services.valueFloor1Card = Number(this.services.numberFloor1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberFloor2) > 0 && this.services.cardFloor2 == true) {
        piso2 = Number(this.services.numberFloor2)
        this.services.valueFloor2Card = Number(this.services.numberFloor2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTherapist) > 0 && this.services.cardTherapist == true) {
        terap = Number(this.services.numberTherapist)
      } else {
        terap = 0
      }

      if (Number(this.services.numberManager) > 0 && this.services.cardManager == true) {
        terap = Number(this.services.numberManager)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.cardDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueCard = suma
      localStorage.setItem('Tarjeta', 'Tarjeta')
      return
    }
  }

  transCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validatePaymentMethod()) return

    if (event) {
      if (Number(this.services.numberFloor1) > 0 && this.services.transactionFloor1 == true) {
        piso1 = Number(this.services.numberFloor1)
        this.services.valueFloor1Transaction = Number(this.services.numberFloor1)
      } else {
        piso1 = 0
      }

      if (Number(this.services.numberFloor2) > 0 && this.services.transactionFloor2 == true) {
        piso2 = Number(this.services.numberFloor2)
        this.services.valueFloor2Transaction = Number(this.services.numberFloor2)
      } else {
        piso2 = 0
      }

      if (Number(this.services.numberTherapist) > 0 && this.services.transactionTherapist == true) {
        terap = Number(this.services.numberTherapist)
      } else {
        terap = 0
      }

      if (Number(this.services.numberManager) > 0 && this.services.transactionManager == true) {
        terap = Number(this.services.numberManager)
      } else {
        encarg = 0
      }

      if (Number(this.services.numberTaxi) > 0 && this.services.transactionDriverTaxi == true) {
        otroservic = Number(this.services.numberTaxi)
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.services.valueTransaction = suma
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

    this.services.payment = formPago.join(',')
  }

  startTime(event: any) {
    this.horaInicialServicio = event.target.value.toString()

    if (Number(this.services.minutes) > 0) {
      let sumarsesion = Number(this.services.minutes), horas = 0, minutos = 0, convertHora = ''

      // Create date by Date and Hour
      const splitDate = this.fechaActual.toString().split('-')
      const splitHour = this.horaInicialServicio.split(':')

      let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))

      defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

      horas = defineDate.getHours()
      minutos = defineDate.getMinutes()
    }
  }

  chosenDate(event: any) {
    this.dateToday = event.target.value
  }

  minutes(event: any) {
    this.services.minutes = Number(event.value)
    let sumarsesion = Number(event.value), day = '', month = '', year = '', hour = '', minutes = 0, dateToday = ''
    if (event === null) sumarsesion = 0

    dateToday = this.dateToday + ' ' + this.horaInicialServicio

    let defineDate = new Date(dateToday)
    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)
    let datesEnd = new Date(dateToday)
    datesEnd.setMinutes(datesEnd.getMinutes() + sumarsesion)

    day = datesEnd.toString().substring(8, 10)
    month = datesEnd.toString().substring(4, 7)
    year = datesEnd.toString().substring(11, 15)
    hour = datesEnd.toString().substring(16, 21)

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

    this.services.dateEnd = `${year}-${month}-${day} ${hour}`
    this.fechaActual = `${year}-${month}-${day} ${hour}`
    this.hourEnd = hour
    this.services.dateStart = this.fechaActual
  }

  serviceValue() {

    let restamos = 0

    this.sumatoriaServicios = Number(this.services.service) + Number(this.services.tip) + Number(this.services.taxi) +
      Number(this.services.drink) + Number(this.services.drinkTherapist) + Number(this.services.tabacco) +
      Number(this.services.vitamin) + Number(this.services.others)

    restamos = Number(this.services.numberFloor1) + Number(this.services.numberFloor2) + Number(this.services.numberTherapist) +
      Number(this.services.numberManager) + Number(this.services.numberTaxi)

    if (Number(this.services.numberFloor1) > 0) {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberFloor2) > 0) {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberTherapist) > 0) {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberManager) > 0) {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (Number(this.services.numberTaxi) > 0) {
      this.restamosCobro = this.sumatoriaServicios - restamos
    }

    if (this.sumatoriaServicios != 0) {
      this.services.numberFloor1 = this.sumatoriaServicios
      this.collectionsValue()
    }
  }

  collectionsValue() {
    let resultado = 0

    this.sumatoriaCobros = Number(this.services.numberFloor1) + Number(this.services.numberFloor2) +
      Number(this.services.numberTherapist) + Number(this.services.numberManager) + Number(this.services.numberTaxi)

    resultado = this.sumatoriaServicios - this.sumatoriaCobros
    this.restamosCobro = resultado
  }

  managerAndTherapist() {

    // Terapeuta
    if (this.services.cashTherapist == true && Number(this.services.numberTherapist) > 0) this.services.valueEfectTherapist = Number(this.services.numberTherapist)
    if (this.services.bizuTherapist == true && Number(this.services.numberTherapist) > 0) this.services.valueBizuTherapist = Number(this.services.numberTherapist)
    if (this.services.cardTherapist == true && Number(this.services.numberTherapist) > 0) this.services.valueCardTherapist = Number(this.services.numberTherapist)
    if (this.services.transactionTherapist == true && Number(this.services.numberTherapist) > 0) this.services.valueTransactionTherapist = Number(this.services.numberTherapist)

    // Encargada
    if (this.services.cashManager == true && Number(this.services.numberManager) > 0) this.services.valueEfectManager = Number(this.services.numberManager)
    if (this.services.bizuManager == true && Number(this.services.numberManager) > 0) this.services.valueBizuManager = Number(this.services.numberManager)
    if (this.services.cardManager == true && Number(this.services.numberManager) > 0) this.services.valueCardManager = Number(this.services.numberManager)
    if (this.services.transactionManager == true && Number(this.services.numberManager) > 0) this.services.valueTransactionManager = Number(this.services.numberManager)
  }

  validatePaymentMethod() {

    // Efectivo
    if (this.services.cashFloor1 == true && this.services.bizuFloor1 == true || this.services.cashFloor2 == true &&
      this.services.bizuFloor2 == true || this.services.cashTherapist == true && this.services.bizuTherapist == true ||
      this.services.cashManager == true && this.services.bizuManager == true || this.services.cashDriverTaxi == true &&
      this.services.bizuDriverTaxi == true || this.services.cashFloor1 == true && this.services.cardFloor1 == true ||
      this.services.cashFloor2 == true && this.services.cardFloor2 == true || this.services.cashTherapist == true &&
      this.services.cardTherapist == true || this.services.cashManager == true && this.services.cardManager == true ||
      this.services.cashDriverTaxi == true && this.services.cardDriverTaxi == true || this.services.cashFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.cashFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.cashTherapist == true && this.services.transactionTherapist == true || this.services.cashManager == true &&
      this.services.transactionManager == true || this.services.cashDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Bizum
    if (this.services.bizuFloor1 == true && this.services.cashFloor1 == true || this.services.bizuFloor2 == true &&
      this.services.cashFloor2 == true || this.services.bizuTherapist == true && this.services.cashTherapist == true ||
      this.services.bizuManager == true && this.services.cashManager == true || this.services.bizuDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.bizuFloor1 == true && this.services.cardFloor1 == true ||
      this.services.bizuFloor2 == true && this.services.cardFloor2 == true || this.services.bizuTherapist == true &&
      this.services.cardTherapist == true || this.services.bizuManager == true && this.services.cardManager == true ||
      this.services.bizuDriverTaxi == true && this.services.cardDriverTaxi == true || this.services.bizuFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.bizuFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.bizuTherapist == true && this.services.transactionTherapist == true || this.services.bizuManager == true &&
      this.services.transactionManager == true || this.services.bizuDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Tarjeta
    if (this.services.cardFloor1 == true && this.services.cashFloor1 == true || this.services.cardFloor2 == true &&
      this.services.cashFloor2 == true || this.services.cardTherapist == true && this.services.cashTherapist == true ||
      this.services.cardManager == true && this.services.cashManager == true || this.services.cardDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.cardFloor1 == true && this.services.bizuFloor1 == true ||
      this.services.cardFloor2 == true && this.services.bizuFloor2 == true || this.services.cardTherapist == true &&
      this.services.bizuTherapist == true || this.services.cardManager == true && this.services.bizuManager == true ||
      this.services.cardDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.cardFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.cardFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.cardTherapist == true && this.services.transactionTherapist == true || this.services.cardManager == true &&
      this.services.transactionManager == true || this.services.cardDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Trans
    if (this.services.transactionFloor1 == true && this.services.cashFloor1 == true || this.services.transactionFloor2 == true &&
      this.services.cashFloor2 == true || this.services.transactionTherapist == true && this.services.cashTherapist == true ||
      this.services.transactionManager == true && this.services.cashManager == true || this.services.transactionDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.transactionFloor1 == true && this.services.bizuFloor1 == true ||
      this.services.transactionFloor2 == true && this.services.bizuFloor2 == true || this.services.transactionTherapist == true &&
      this.services.bizuTherapist == true || this.services.transactionManager == true && this.services.bizuManager == true ||
      this.services.transactionDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.transactionFloor1 == true &&
      this.services.cardFloor1 == true || this.services.transactionFloor2 == true && this.services.cardFloor2 == true ||
      this.services.transactionTherapist == true && this.services.cardTherapist == true || this.services.transactionManager == true &&
      this.services.cardManager == true || this.services.transactionDriverTaxi == true && this.services.cardDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }
    return true
  }

  validatePayment() {

    // Efectivo
    if (this.services.cashFloor1 == true && this.services.bizuFloor1 == true || this.services.cashFloor2 == true &&
      this.services.bizuFloor2 == true || this.services.cashTherapist == true && this.services.bizuTherapist == true ||
      this.services.cashManager == true && this.services.bizuManager == true || this.services.cashDriverTaxi == true &&
      this.services.bizuDriverTaxi == true || this.services.cashFloor1 == true && this.services.cardFloor1 == true ||
      this.services.cashFloor2 == true && this.services.cardFloor2 == true || this.services.cashTherapist == true &&
      this.services.cardTherapist == true || this.services.cashManager == true && this.services.cardManager == true ||
      this.services.cashDriverTaxi == true && this.services.cardDriverTaxi == true || this.services.cashFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.cashFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.cashTherapist == true && this.services.transactionTherapist == true || this.services.cashManager == true &&
      this.services.transactionManager == true || this.services.cashDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Bizum
    if (this.services.bizuFloor1 == true && this.services.cashFloor1 == true || this.services.bizuFloor2 == true &&
      this.services.cashFloor2 == true || this.services.bizuTherapist == true && this.services.cashTherapist == true ||
      this.services.bizuManager == true && this.services.cashManager == true || this.services.bizuDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.bizuFloor1 == true && this.services.cardFloor1 == true ||
      this.services.bizuFloor2 == true && this.services.cardFloor2 == true || this.services.bizuTherapist == true &&
      this.services.cardTherapist == true || this.services.bizuManager == true && this.services.cardManager == true ||
      this.services.bizuDriverTaxi == true && this.services.cardDriverTaxi == true || this.services.bizuFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.bizuFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.bizuTherapist == true && this.services.transactionTherapist == true || this.services.bizuManager == true &&
      this.services.transactionManager == true || this.services.bizuDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Tarjeta
    if (this.services.cardFloor1 == true && this.services.cashFloor1 == true || this.services.cardFloor2 == true &&
      this.services.cashFloor2 == true || this.services.cardTherapist == true && this.services.cashTherapist == true ||
      this.services.cardManager == true && this.services.cashManager == true || this.services.cardDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.cardFloor1 == true && this.services.bizuFloor1 == true ||
      this.services.cardFloor2 == true && this.services.bizuFloor2 == true || this.services.cardTherapist == true &&
      this.services.bizuTherapist == true || this.services.cardManager == true && this.services.bizuManager == true ||
      this.services.cardDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.cardFloor1 == true &&
      this.services.transactionFloor1 == true || this.services.cardFloor2 == true && this.services.transactionFloor2 == true ||
      this.services.cardTherapist == true && this.services.transactionTherapist == true || this.services.cardManager == true &&
      this.services.transactionManager == true || this.services.cardDriverTaxi == true && this.services.transactionDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }

    // Trans
    if (this.services.transactionFloor1 == true && this.services.cashFloor1 == true || this.services.transactionFloor2 == true &&
      this.services.cashFloor2 == true || this.services.transactionTherapist == true && this.services.cashTherapist == true ||
      this.services.transactionManager == true && this.services.cashManager == true || this.services.transactionDriverTaxi == true &&
      this.services.cashDriverTaxi == true || this.services.transactionFloor1 == true && this.services.bizuFloor1 == true ||
      this.services.transactionFloor2 == true && this.services.bizuFloor2 == true || this.services.transactionTherapist == true &&
      this.services.bizuTherapist == true || this.services.transactionManager == true && this.services.bizuManager == true ||
      this.services.transactionDriverTaxi == true && this.services.bizuDriverTaxi == true || this.services.transactionFloor1 == true &&
      this.services.cardFloor1 == true || this.services.transactionFloor2 == true && this.services.cardFloor2 == true ||
      this.services.transactionTherapist == true && this.services.cardTherapist == true || this.services.transactionManager == true &&
      this.services.cardManager == true || this.services.transactionDriverTaxi == true && this.services.cardDriverTaxi == true) {
      this.presentController('Se escogio mas de una forma de pago')
      return false
    }
    return true
  }

  paymentMethodValidation() {
    if (Number(this.services.numberFloor1) > 0 && this.services.cashFloor1 == false && this.services.bizuFloor1 == false &&
      this.services.cardFloor1 == false && this.services.transactionFloor1 == false) {
      this.presentController('No se escogio ninguna forma de pago para piso 1')
      return false
    }
    if (Number(this.services.numberFloor2) > 0 && this.services.cashFloor2 == false && this.services.bizuFloor2 == false &&
      this.services.cardFloor2 == false && this.services.transactionFloor2 == false) {
      this.presentController('No se escogio ninguna forma de pago para piso 2')
      return false
    }
    if (Number(this.services.numberTherapist) > 0 && this.services.cashTherapist == false && this.services.bizuTherapist == false &&
      this.services.cardTherapist == false && this.services.transactionTherapist == false) {
      this.presentController('No se escogio ninguna forma de pago para terapeuta')
      return false
    }
    if (Number(this.services.numberManager) > 0 && this.services.cashManager == false && this.services.bizuManager == false &&
      this.services.cardManager == false && this.services.transactionManager == false) {
      this.presentController('No se escogio ninguna forma de pago para encargada')
      return false
    }
    if (Number(this.services.numberTaxi) > 0 && this.services.cashDriverTaxi == false && this.services.bizuDriverTaxi == false &&
      this.services.cardDriverTaxi == false && this.services.transactionDriverTaxi == false) {
      this.presentController('No se escogio ninguna forma de pago para taxista')
      return false
    }
    return true
  }

  selectTerap(name: string) {
    this.getLastDate()

    this.serviceServices.getByTherapistIdDesc(name).subscribe((rp: any) => {
      if (rp['service'].length > 0) {
        this.hourStartTerapeuta = rp['service'][0]['dateStart'].substring(11, 16)
        this.horaEndTerapeuta = rp['service'][0]['dateEnd'].substring(11, 16)
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

  async presentController(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'middle',
      cssClass: 'toast-class',
    });
    toast.present();
  }
}