import { Component, OnInit } from '@angular/core';
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
  selector: 'app-edit-services',
  templateUrl: './edit-services.page.html',
  styleUrls: ['./edit-services.page.scss'],
})

export class EditServicesPage implements OnInit {
  hourStart = ''
  hourEnd = ''
  dateStart = ''

  dateToday = dayjs().format("YYYY-MM-DD")
  fechaActual = ''
  horaStarted = new Date().toTimeString().substring(0, 5)
  modifiedUser = ''
  horaInicialServicio: string

  idUser: number
  id: number
  manager = []
  terapeuta: any
  administratorRole: boolean = false

  restamosCobroEdit = 0
  sumatoriaCobrosEdit = ''
  sumatoriaServices = ''
  idEditar: number
  editarService: ModelService[]
  buttonEdit: any
  buttonDelete = false

  servicioTotal = 0
  validateEfect = false
  validateBizum = false
  validateTarjeta = false
  validateTrans = false

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
    updated_at: "",
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
    dateEnd: dayjs().format("YYYY-MM-DD"),
    exit: "",
    minutes: 0,
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private serviceServices: ServiceService,
    private ionLoaderService: IonLoaderService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const params = this.activeRoute.snapshot.params
    this.id = Number(params['id'])

    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = param['id']

    if (this.idUser) {
      this.serviceManager.getId(this.idUser).subscribe((rp) => {
        this.modifiedUser = rp['manager'].name
        if (rp['manager'].rol == 'Administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.manager = [rp['manager']]
          this.services.manager = this.manager['name']
        }
      })
    }

    this.horaInicialServicio = this.horaStarted
    this.getTherapist()
    this.editForm()
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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
      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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
      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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
      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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
      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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
      var screen = document.querySelector<HTMLElement>(".editar-servicio")
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

  getManager() {
    this.serviceManager.getManager().subscribe((rp: any) => {
      this.manager = rp['manager']
    })
  }

  getTherapist() {
    this.serviceTherapist.getTherapist().subscribe((rp: any) => {
      this.terapeuta = rp['therapist']
    })
  }

  paymentMethod(): void {
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

    this.editarService[0]['formaPago'] = formPago.join(',')
    this.services.payment = formPago.join(',')
  }

  expiredDateValidationsEdit() {
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
      Swal.fire({
        heightAuto: false,
        icon: 'error',
        title: 'Oops...',
        text: 'No se puede editar el servicio por la fecha.',
        showConfirmButton: false,
        timer: 2500,
      });
      return false
    }

    return true
  }

  startTime(event: any) {
    this.horaInicialServicio = event.target.value.toString()

    if (Number(this.editarService[0]['minuto']) > 0) {
      let sumarsesion = Number(this.editarService[0]['minuto']), horas = 0, minutos = 0, convertHora = ''

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
        this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.editarService[0]['horaEnd'] = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }

    if (Number(this.services.minutes) > 0) {
      let sumarsesion = Number(this.services.minutes), horas = 0, minutos = 0, convertHora = ''

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
        this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.editarService[0]['horaEnd'] = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }
  }

  chosenDate(event: any) {
    this.editarService[0]['dateToday'] = event.target.value
    this.fechaActual = event.target.value
  }

  minutes(event: any) {
    let sumarsesion = Number(event.value), day = '', month = '', year = '', hour = '', dateToday = ''
    if (event === null) sumarsesion = 0

    dateToday = this.dateToday + ' ' + this.editarService[0].dateEnd.substring(11, 16)

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

    this.editarService[0]['dateEnd'] = `${year}-${month}-${day} ${hour}`
  }

  validationsFormOfPayment() {
    // Efectivo
    if (Boolean(this.editarService[0]['cashFloor1']) == true && Boolean(this.editarService[0]['bizuFloor1']) == true ||
      Boolean(this.editarService[0]['cashFloor2']) == true && Boolean(this.editarService[0]['bizuFloor2']) == true ||
      Boolean(this.editarService[0]['cashTherapist']) == true && Boolean(this.editarService[0]['bizuTherapist']) == true ||
      Boolean(this.editarService[0]['cashManager']) == true && Boolean(this.editarService[0]['bizuManager']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['cashFloor1']) == true && Boolean(this.editarService[0]['cardFloor1']) == true ||
      Boolean(this.editarService[0]['cashFloor2']) == true && Boolean(this.editarService[0]['cardFloor2']) == true ||
      Boolean(this.editarService[0]['cashTherapist']) == true && Boolean(this.editarService[0]['cardTherapist']) == true ||
      Boolean(this.editarService[0]['cashManager']) == true && Boolean(this.editarService[0]['cardManager']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true ||
      Boolean(this.editarService[0]['cashFloor1']) == true && Boolean(this.editarService[0]['transactionFloor1']) == true ||
      Boolean(this.editarService[0]['cashFloor2']) == true && Boolean(this.editarService[0]['transactionFloor2']) == true ||
      Boolean(this.editarService[0]['cashTherapist']) == true && Boolean(this.editarService[0]['transactionTherapist']) == true ||
      Boolean(this.editarService[0]['cashManager']) == true && Boolean(this.editarService[0]['transactionManager']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (Boolean(this.editarService[0]['bizuFloor1']) == true && Boolean(this.editarService[0]['cashFloor1']) == true ||
      Boolean(this.editarService[0]['bizuFloor2']) == true && Boolean(this.editarService[0]['cashFloor2']) == true ||
      Boolean(this.editarService[0]['bizuTherapist']) == true && Boolean(this.editarService[0]['cashTherapist']) == true ||
      Boolean(this.editarService[0]['bizuManager']) == true && Boolean(this.editarService[0]['cashManager']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['bizuFloor1']) == true && Boolean(this.editarService[0]['cardFloor1']) == true ||
      Boolean(this.editarService[0]['bizuFloor2']) == true && Boolean(this.editarService[0]['cardFloor2']) == true ||
      Boolean(this.editarService[0]['bizuTherapist']) == true && Boolean(this.editarService[0]['cardTherapist']) == true ||
      Boolean(this.editarService[0]['bizuManager']) == true && Boolean(this.editarService[0]['cardManager']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true ||
      Boolean(this.editarService[0]['bizuFloor1']) == true && Boolean(this.editarService[0]['transactionFloor1']) == true ||
      Boolean(this.editarService[0]['bizuFloor2']) == true && Boolean(this.editarService[0]['transactionFloor2']) == true ||
      Boolean(this.editarService[0]['bizuTherapist']) == true && Boolean(this.editarService[0]['transactionTherapist']) == true ||
      Boolean(this.editarService[0]['bizuManager']) == true && Boolean(this.editarService[0]['transactionManager']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (Boolean(this.editarService[0]['cardFloor1']) == true && Boolean(this.editarService[0]['cashFloor1']) == true ||
      Boolean(this.editarService[0]['cardFloor2']) == true && Boolean(this.editarService[0]['cashFloor2']) == true ||
      Boolean(this.editarService[0]['cardTherapist']) == true && Boolean(this.editarService[0]['cashTherapist']) == true ||
      Boolean(this.editarService[0]['cardManager']) == true && Boolean(this.editarService[0]['cashManager']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['cardFloor1']) == true && Boolean(this.editarService[0]['bizuFloor1']) == true ||
      Boolean(this.editarService[0]['cardFloor2']) == true && Boolean(this.editarService[0]['bizuFloor2']) == true ||
      Boolean(this.editarService[0]['cardTherapist']) == true && Boolean(this.editarService[0]['bizuTherapist']) == true ||
      Boolean(this.editarService[0]['cardManager']) == true && Boolean(this.editarService[0]['bizuManager']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['cardFloor1']) == true && Boolean(this.editarService[0]['transactionFloor1']) == true ||
      Boolean(this.editarService[0]['cardFloor2']) == true && Boolean(this.editarService[0]['transactionFloor2']) == true ||
      Boolean(this.editarService[0]['cardTherapist']) == true && Boolean(this.editarService[0]['transactionTherapist']) == true ||
      Boolean(this.editarService[0]['cardManager']) == true && Boolean(this.editarService[0]['transactionManager']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (Boolean(this.editarService[0]['transactionFloor1']) == true && Boolean(this.editarService[0]['cashFloor1']) == true ||
      Boolean(this.editarService[0]['transactionFloor2']) == true && Boolean(this.editarService[0]['cashFloor2']) == true ||
      Boolean(this.editarService[0]['transactionTherapist']) == true && Boolean(this.editarService[0]['cashTherapist']) == true ||
      Boolean(this.editarService[0]['transactionManager']) == true && Boolean(this.editarService[0]['cashManager']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['transactionFloor1']) == true && Boolean(this.editarService[0]['bizuFloor1']) == true ||
      Boolean(this.editarService[0]['transactionFloor2']) == true && Boolean(this.editarService[0]['bizuFloor2']) == true ||
      Boolean(this.editarService[0]['transactionTherapist']) == true && Boolean(this.editarService[0]['bizuTherapist']) == true ||
      Boolean(this.editarService[0]['transactionManager']) == true && Boolean(this.editarService[0]['bizuManager']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['transactionFloor1']) == true && Boolean(this.editarService[0]['cardFloor1']) == true ||
      Boolean(this.editarService[0]['transactionFloor2']) == true && Boolean(this.editarService[0]['cardFloor2']) == true ||
      Boolean(this.editarService[0]['transactionTherapist']) == true && Boolean(this.editarService[0]['cardTherapist']) == true ||
      Boolean(this.editarService[0]['transactionManager']) == true && Boolean(this.editarService[0]['cardManager']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validationsToSelectAPaymentMethod() {

    if (Number(this.editarService[0]['numberFloor1']) > 0 && Boolean(this.editarService[0]['cashFloor1']) == false &&
      Boolean(this.editarService[0]['bizuFloor1']) == false && Boolean(this.editarService[0]['cardFloor1']) == false &&
      Boolean(this.editarService[0]['transactionFloor1']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.editarService[0]['numberFloor2']) > 0 && Boolean(this.editarService[0]['cashFloor2']) == false &&
      Boolean(this.editarService[0]['bizuFloor2']) == false && Boolean(this.editarService[0]['cardFloor2']) == false &&
      Boolean(this.editarService[0]['transactionFloor2']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.editarService[0]['numberTherapist']) > 0 && Boolean(this.editarService[0]['cashTherapist']) == false &&
      Boolean(this.editarService[0]['bizuTherapist']) == false && Boolean(this.editarService[0]['cardTherapist']) == false &&
      Boolean(this.editarService[0]['transactionTherapist']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.editarService[0]['numberManager']) > 0 && Boolean(this.editarService[0]['cashManager']) == false &&
      Boolean(this.editarService[0]['bizuManager']) == false && Boolean(this.editarService[0]['cardManager']) == false &&
      Boolean(this.editarService[0]['transactionManager']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.editarService[0]['numberTaxi']) > 0 && Boolean(this.editarService[0]['efectDriverTaxi']) == false &&
      Boolean(this.editarService[0]['bizuDriverTaxi']) == false && Boolean(this.editarService[0]['tarjDriverTaxi']) == false &&
      Boolean(this.editarService[0]['transDriverTaxi']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para taxista' })
      return false
    }
    return true
  }

  editForm() {
    let day = '', month = '', year = ''

    this.serviceServices.getByIdEditTrue(this.id).subscribe((rp: any) => {
      if (rp['service'].length > 0) {
        this.services.screen = rp['service'][0].screen
        this.editarService = rp['service']
        this.fechaActual = rp['service'][0]['dateToday'].substring(0, 10)

        this.hourStart = rp['service'][0]['dateStart'].substring(11, 16)
        this.hourEnd = rp['service'][0]['dateEnd'].substring(11, 16)

        day = this.editarService[0].dateStart.substring(8, 10)
        month = this.editarService[0].dateStart.substring(5, 7)
        year = this.editarService[0].dateStart.substring(0, 4)
        this.dateStart = `${year}-${month}-${day}`

        this.services.updated_at = dayjs().format("YYYY-MM-DD HH:mm:s")
        console.log(this.services)
        debugger

        this.collectionsValue()

        this.serviceManager.idAdmin(this.idUser).subscribe((rp: any[]) => {
          if (rp['manager'].length > 0) {
            this.buttonDelete = true
          } else {
            this.buttonDelete = false
          }
        })

        setTimeout(() => {
          this.buttonEdit = document.getElementById('btnEdit') as HTMLButtonElement
          this.validateCheck()
        }, 200)

      } else {
        this.serviceManager.getId(this.idUser).subscribe((datoUser: any[]) => {
          this.idUser = datoUser[0]
        })
      }
    })
  }

  fullService() {
    let piso1 = 0, piso2 = 0, terap = 0, encargada = 0, otros = 0

    if (Number(this.editarService[0]['numberFloor1']) == 0) {
      piso1 = 0
      this.editarService[0]['numberFloor1'] = 0
    } else {
      piso1 = Number(this.editarService[0]['numberFloor1'])
    }

    if (Number(this.editarService[0]['numberFloor2']) == 0) {
      piso2 = 0
      this.editarService[0]['numberFloor2'] = 0
    } else {
      piso2 = Number(this.editarService[0]['numberFloor2'])
    }

    if (Number(this.editarService[0]['numberTherapist']) == 0) {
      terap = 0
      this.editarService[0]['numberTherapist'] = 0
    } else {
      terap = Number(this.editarService[0]['numberTherapist'])
    }

    if (Number(this.editarService[0]['numberManager']) == 0) {
      encargada = 0
      this.editarService[0]['numberManager'] = 0
    } else {
      encargada = Number(this.editarService[0]['numberManager'])
    }

    if (Number(this.editarService[0]['numberTaxi']) == 0) {
      otros = 0
      this.editarService[0]['numberTaxi'] = 0
    } else {
      otros = Number(this.editarService[0]['numberTaxi'])
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros)

    if (Number(this.editarService[0]['service']) == 0) {
      otros = 0
      this.editarService[0]['service'] = 0
    } else {
      otros = Number(this.editarService[0]['service'])
    }

    if (Number(this.editarService[0]['drink']) == 0) {
      otros = 0
      this.editarService[0]['drink'] = 0
    } else {
      otros = Number(this.editarService[0]['drink'])
    }

    if (Number(this.editarService[0]['drinkTherapist']) == 0) {
      otros = 0
      this.editarService[0]['drinkTherapist'] = 0
    } else {
      otros = Number(this.editarService[0]['drinkTherapist'])
    }

    if (Number(this.editarService[0]['tabacco']) == 0) {
      otros = 0
      this.editarService[0]['tabacco'] = 0
    } else {
      otros = Number(this.editarService[0]['tabacco'])
    }

    if (Number(this.editarService[0]['taxi']) == 0) {
      otros = 0
      this.editarService[0]['taxi'] = 0
    } else {
      otros = Number(this.editarService[0]['taxi'])
    }

    if (Number(this.editarService[0]['vitamin']) == 0) {
      otros = 0
      this.editarService[0]['vitamin'] = 0
    } else {
      otros = Number(this.editarService[0]['vitamin'])
    }

    if (Number(this.editarService[0]['tip']) == 0) {
      otros = 0
      this.editarService[0]['tip'] = 0
    } else {
      otros = Number(this.editarService[0]['tip'])
    }

    if (Number(this.editarService[0]['others']) == 0) {
      otros = 0
      this.editarService[0]['others'] = 0
    } else {
      otros = Number(this.editarService[0]['others'])
    }
  }

  serviceValue() {
    let servicioEdit = 0, bebidaEdit = 0, bebidaTerapEdit = 0, tabacoEdit = 0, taxiEdit = 0, vitaminasEdit = 0, propinaEdit = 0, otrosEdit = 0, sumatoriaEdit = 0

    if (Number(this.editarService[0]['service']) > 0) {
      servicioEdit = Number(this.editarService[0]['service'])
    } else {
      servicioEdit = 0
    }

    if (Number(this.editarService[0]['drink']) > 0) {
      bebidaEdit = Number(this.editarService[0]['drink'])
    } else {
      bebidaEdit = 0
    }

    if (Number(this.editarService[0]['drinkTherapist']) > 0) {
      bebidaTerapEdit = Number(this.editarService[0]['drinkTherapist'])
    } else {
      bebidaTerapEdit = 0
    }

    if (Number(this.editarService[0]['tabacco']) > 0) {
      tabacoEdit = Number(this.editarService[0]['tabacco'])
    } else {
      tabacoEdit = 0
    }

    if (Number(this.editarService[0]['taxi']) > 0) {
      taxiEdit = Number(this.editarService[0]['taxi'])
    } else {
      taxiEdit = 0
    }

    if (Number(this.editarService[0]['vitamin']) > 0) {
      vitaminasEdit = Number(this.editarService[0]['vitamin'])
    } else {
      vitaminasEdit = 0
    }

    if (Number(this.editarService[0]['tip']) > 0) {
      propinaEdit = Number(this.editarService[0]['tip'])
    } else {
      propinaEdit = 0
    }

    if (Number(this.editarService[0]['others']) > 0) {
      otrosEdit = Number(this.editarService[0]['others'])
    } else {
      otrosEdit = 0
    }

    sumatoriaEdit = servicioEdit + propinaEdit + taxiEdit + vitaminasEdit + tabacoEdit + otrosEdit + bebidaEdit + bebidaTerapEdit
    this.editarService[0]['totalServicio'] = sumatoriaEdit
    this.restamosCobroEdit = sumatoriaEdit

    const restamosEdit = Number(this.editarService[0]['numberFloor1']) + Number(this.editarService[0]['numberFloor2']) + Number(this.editarService[0]['numberTherapist']) +
      Number(this.editarService[0]['numberManager']) + Number(this.editarService[0]['numberTaxi'])

    if (Number(this.editarService[0]['numberFloor1']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberFloor2']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTherapist']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberManager']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTaxi']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }
  }

  collectionsValue() {
    let valuepiso1Edit = 0, valuepiso2Edit = 0, valueterapeutaEdit = 0, valueEncargEdit = 0, valueotrosEdit = 0, restamosEdit = 0, resultadoEdit = 0

    if (this.editarService[0].numberFloor1 > 0) {
      valuepiso1Edit = Number(this.editarService[0].numberFloor1)
    } else {
      valuepiso1Edit = 0
    }

    if (this.editarService[0].numberFloor2 > 0) {
      valuepiso2Edit = Number(this.editarService[0].numberFloor2)
    } else {
      valuepiso2Edit = 0
    }

    if (this.editarService[0].numberTherapist > 0) {
      valueterapeutaEdit = Number(this.editarService[0].numberTherapist)
    } else {
      valueterapeutaEdit = 0
    }

    if (this.editarService[0].numberManager > 0) {
      valueEncargEdit = Number(this.editarService[0].numberManager)
    } else {
      valueEncargEdit = 0
    }

    if (this.editarService[0].numberTaxi > 0) {
      valueotrosEdit = Number(this.editarService[0].numberTaxi)
    } else {
      valueotrosEdit = 0
    }

    if (this.editarService[0].totalService > 0) {
      resultadoEdit = Number(this.editarService[0].totalService) - valuepiso1Edit

      const totalService = this.editarService[0].totalService

      if (this.editarService[0].totalService > 999)
        this.sumatoriaServices = (totalService / 1000).toFixed(3)
      else
        this.sumatoriaServices = totalService.toString()
    }

    const sumCobros = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit
    this.sumatoriaCobrosEdit = sumCobros.toString()

    if (sumCobros > 999)
      this.sumatoriaCobrosEdit = (sumCobros / 1000).toFixed(3)
    else
      this.sumatoriaCobrosEdit = sumCobros.toString()

    restamosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit
    resultadoEdit = sumCobros - restamosEdit
    this.restamosCobroEdit = resultadoEdit
  }

  validateCheck() {

    // Cash
    if (Boolean(this.editarService[0].cashFloor1) === true) {
      document.getElementById("cashHouse1").style.background = '#1fb996'
      this.services.cashFloor1 = true
    }

    if (Boolean(this.editarService[0].cashFloor2) === true) {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.cashFloor2 = true
    }

    if (Boolean(this.editarService[0].cashTherapist) === true) {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.cashTherapist = true
    }

    if (Boolean(this.editarService[0].cashManager) === true) {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.cashManager = true
    }

    // Bizum

    if (Boolean(this.editarService[0].bizuFloor1) == true) {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuFloor1 = true
    }

    if (Boolean(this.editarService[0].bizuFloor2) == true) {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuFloor2 = true
    }

    if (Boolean(this.editarService[0].bizuTherapist) == true) {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTherapist = true
    }

    if (Boolean(this.editarService[0].bizuManager) == true) {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuManager = true
    }

    // Card 

    if (Boolean(this.editarService[0].cardFloor1) == true) {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.cardFloor1 = true
    }

    if (Boolean(this.editarService[0].cardFloor2) == true) {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.cardFloor2 = true
    }

    if (Boolean(this.editarService[0].cardTherapist) == true) {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.cardTherapist = true
    }

    if (Boolean(this.editarService[0].cardManager) == true) {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.cardManager = true
    }

    // Trans

    if (Boolean(this.editarService[0].transactionFloor1) == true) {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transactionFloor1 = true
    }

    if (Boolean(this.editarService[0].transactionFloor2) == true) {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transactionFloor2 = true
    }

    if (Boolean(this.editarService[0].transactionTherapist) == true) {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transactionTherapist = true
    }

    if (Boolean(this.editarService[0].transactionManager) == true) {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transactionManager = true
    }
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroserv = 0, suma = 0
    if (!this.validationsFormOfPayment()) return

    if (event) {

      if (Number(this.editarService[0]['numberFloor1']) > 0 && Boolean(this.editarService[0]['cashFloor1']) === true) {
        piso1 = Number(this.editarService[0]['numberFloor1'])
        this.editarService[0]['valueFloor1Cash'] = Number(this.editarService[0]['numberFloor1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberFloor2']) > 0 && Boolean(this.editarService[0]['cashFloor2']) === true) {
        piso2 = Number(this.editarService[0]['numberFloor2'])
        this.editarService[0]['valueFloor2Cash'] = Number(this.editarService[0]['numberFloor2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTherapist']) > 0 && Boolean(this.editarService[0]['cashTherapist']) === true) {
        terap = Number(this.editarService[0]['numberTherapist'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberManager']) > 0 && Boolean(this.editarService[0]['cashManager']) === true) {
        encarg = Number(this.editarService[0]['numberManager'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && Boolean(this.editarService[0]['efectDriverTaxi']) === true) {
        otroserv = Number(this.editarService[0]['numberTaxi'])
      } else {
        otroserv = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroserv
      this.editarService[0]['valueEfectivo'] = suma
      localStorage.setItem('Efectivo', 'Efectivo')
      return

    }
  }

  bizumCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPayment()) return
    if (event) {

      if (Number(this.editarService[0]['numberFloor1']) > 0 && Boolean(this.editarService[0]['bizuFloor1']) === true) {
        piso1 = Number(this.editarService[0]['numberFloor1'])
        this.editarService[0]['valueFloor1Bizum'] = Number(this.editarService[0]['numberFloor1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberFloor2']) > 0 && Boolean(this.editarService[0]['bizuFloor2']) === true) {
        piso2 = Number(this.editarService[0]['numberFloor2'])
        this.editarService[0]['valueFloor2Bizum'] = Number(this.editarService[0]['numberFloor2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTherapist']) > 0 && Boolean(this.editarService[0]['bizuTherapist']) === true) {
        terap = Number(this.editarService[0]['numberTherapist'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberManager']) > 0 && Boolean(this.editarService[0]['bizuManager']) === true) {
        encarg = Number(this.editarService[0]['numberManager'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && Boolean(this.editarService[0]['bizuDriverTaxi']) === true) {
        otroservic = Number(this.editarService[0]['numberTaxi'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueBizum'] = suma
      localStorage.setItem('Bizum', 'Bizum')
      return
    }
  }

  tarjCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPayment()) return
    if (event) {

      if (Number(this.editarService[0]['numberFloor1']) > 0 && Boolean(this.editarService[0]['cardFloor1']) === true) {
        piso1 = Number(this.editarService[0]['numberFloor1'])
        this.editarService[0]['valueFloor1Card'] = Number(this.editarService[0]['numberFloor1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberFloor2']) > 0 && Boolean(this.editarService[0]['cardFloor2']) === true) {
        piso2 = Number(this.editarService[0]['numberFloor2'])
        this.editarService[0]['valueFloor2Card'] = Number(this.editarService[0]['numberFloor2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTherapist']) > 0 && Boolean(this.editarService[0]['cardTherapist']) === true) {
        terap = Number(this.editarService[0]['numberTherapist'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberManager']) > 0 && Boolean(this.editarService[0]['cardManager']) === true) {
        encarg = Number(this.editarService[0]['numberManager'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && Boolean(this.editarService[0]['tarjDriverTaxi']) === true) {
        otroservic = Number(this.editarService[0]['numberTaxi'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueTarjeta'] = suma
      localStorage.setItem('Tarjeta', 'Tarjeta')
      return
    }
  }

  transCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPayment()) return
    if (event) {

      if (Number(this.editarService[0]['numberFloor1']) > 0 && Boolean(this.editarService[0]['transactionFloor1']) === true) {
        piso1 = Number(this.editarService[0]['numberFloor1'])
        this.editarService[0]['valueFloor1Transaction'] = Number(this.editarService[0]['numberFloor1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberFloor2']) > 0 && Boolean(this.editarService[0]['transactionFloor2']) === true) {
        piso2 = Number(this.editarService[0]['numberFloor2'])
        this.editarService[0]['valueFloor2Transaction'] = Number(this.editarService[0]['numberFloor2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTherapist']) > 0 && Boolean(this.editarService[0]['transactionTherapist']) === true) {
        terap = Number(this.editarService[0]['numberTherapist'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberManager']) > 0 && Boolean(this.editarService[0]['transactionManager']) === true) {
        encarg = Number(this.editarService[0]['numberManager'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && Boolean(this.editarService[0]['transDriverTaxi']) === true) {
        otroservic = Number(this.editarService[0]['numberTaxi'])
      } else {
        otroservic = 0
      }

      suma = piso1 + piso2 + terap + encarg + otroservic
      this.editarService[0]['valueTrans'] = suma
      localStorage.setItem('Trans', 'Trans')
      return
    }
  }

  editValue() {
    if (Boolean(this.editarService[0]['cashFloor1']) == true) this.editarService[0]['valueFloor1Cash'] = Number(this.editarService[0]['numberFloor1'])
    else this.editarService[0]['valueFloor1Cash'] = 0

    if (Boolean(this.editarService[0]['cashFloor2']) == true) this.editarService[0]['valueFloor2Cash'] = Number(this.editarService[0]['numberFloor2'])
    else this.editarService[0]['valueFloor2Cash'] = 0

    if (Boolean(this.editarService[0]['bizuFloor1']) == true) this.editarService[0]['valueFloor1Bizum'] = Number(this.editarService[0]['numberFloor1'])
    else this.editarService[0]['valueFloor1Bizum'] = 0

    if (Boolean(this.editarService[0]['bizuFloor2']) == true) this.editarService[0]['valueFloor2Bizum'] = Number(this.editarService[0]['numberFloor2'])
    else this.editarService[0]['valueFloor2Bizum'] = 0

    if (Boolean(this.editarService[0]['cardFloor1']) == true) this.editarService[0]['valueFloor1Card'] = Number(this.editarService[0]['numberFloor1'])
    else this.editarService[0]['valueFloor1Card'] = 0

    if (Boolean(this.editarService[0]['cardFloor2']) == true) this.editarService[0]['valueFloor2Card'] = Number(this.editarService[0]['numberFloor2'])
    else this.editarService[0]['valueFloor2Card'] = 0

    if (Boolean(this.editarService[0]['transactionFloor1']) == true) this.editarService[0]['valueFloor1Transaction'] = Number(this.editarService[0]['numberFloor1'])
    else this.editarService[0]['valueFloor1Transaction'] = 0

    if (Boolean(this.editarService[0]['transactionFloor2']) == true) this.editarService[0]['valueFloor2Transaction'] = Number(this.editarService[0]['numberFloor2'])
    else this.editarService[0]['valueFloor2Transaction'] = 0
  }

  managerAndTherapist() {

    if (Boolean(this.editarService[0]['cashTherapist']) == true && Number(this.editarService[0]['numberTherapist']) > 0) {
      this.editarService[0]['valueEfectTerapeuta'] = Number(this.editarService[0]['numberTherapist'])
    } else {
      this.editarService[0]['valueEfectTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['bizuTherapist']) == true && Number(this.editarService[0]['numberTherapist']) > 0) {
      this.editarService[0]['valueBizuTerapeuta'] = Number(this.editarService[0]['numberTherapist'])
    } else {
      this.editarService[0]['valueBizuTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['cardTherapist']) == true && Number(this.editarService[0]['numberTherapist']) > 0) {
      this.editarService[0]['valueTarjeTerapeuta'] = Number(this.editarService[0]['numberTherapist'])
    } else {
      this.editarService[0]['valueTarjeTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['transactionTherapist']) == true && Number(this.editarService[0]['numberTherapist']) > 0) {
      this.editarService[0]['valueTransTerapeuta'] = Number(this.editarService[0]['numberTherapist'])
    } else {
      this.editarService[0]['valueTransTerapeuta'] = 0
    }

    // Encargada

    if (Boolean(this.editarService[0]['cashManager']) == true && Number(this.editarService[0]['numberManager']) > 0) {
      this.editarService[0]['valueEfectEncargada'] = Number(this.editarService[0]['numberManager'])
    } else {
      this.editarService[0]['valueEfectEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['bizuManager']) == true && Number(this.editarService[0]['numberManager']) > 0) {
      this.editarService[0]['valueBizuEncargada'] = Number(this.editarService[0]['numberManager'])
    } else {
      this.editarService[0]['valueBizuEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['cardManager']) == true && Number(this.editarService[0]['numberManager']) > 0) {
      this.editarService[0]['valueTarjeEncargada'] = Number(this.editarService[0]['numberManager'])
    } else {
      this.editarService[0]['valueTarjeEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['transactionManager']) == true && Number(this.editarService[0]['numberManager']) > 0) {
      this.editarService[0]['valueTransEncargada'] = Number(this.editarService[0]['numberManager'])
    } else {
      this.editarService[0]['valueTransEncargada'] = 0
    }
  }

  bizumFloor1() {
    if (document.getElementById('bizumHouse1').style.background == "") {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuFloor1 = true
      this.editarService[0].bizuFloor1 = true
    } else {
      document.getElementById('bizumHouse1').style.background = ""
      this.services.bizuFloor1 = false
      this.editarService[0].bizuFloor1 = false
    }

    this.validationsFormOfPayment()
  }

  cardFloor1() {
    if (document.getElementById('cardHouse1').style.background == "") {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.cardFloor1 = true
      this.editarService[0].cardFloor1 = true
    } else {
      document.getElementById('cardHouse1').style.background = ""
      this.services.cardFloor1 = false
      this.editarService[0].cardFloor1 = false
    }

    this.validationsFormOfPayment()
  }

  transFloor1() {
    if (document.getElementById('transHouse1').style.background == "") {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transactionFloor1 = true
      this.editarService[0].transactionFloor1 = true
    } else {
      document.getElementById('transHouse1').style.background = ""
      this.services.transactionFloor1 = false
      this.editarService[0].transactionFloor1 = false
    }

    this.validationsFormOfPayment()
  }

  cashFloor1() {
    if (document.getElementById('cashHouse1').style.background == "") {
      document.getElementById('cashHouse1').style.background = '#1fb996'
      this.services.cashFloor1 = true
      this.editarService[0].cashFloor1 = true
    } else {
      document.getElementById('cashHouse1').style.background = ""
      this.services.cashFloor1 = false
      this.editarService[0].cashFloor1 = false
    }

    this.validationsFormOfPayment()
  }

  bizumFloor2() {
    if (document.getElementById('bizumHouse2').style.background == "") {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuFloor2 = true
      this.editarService[0].bizuFloor2 = true
    } else {
      document.getElementById('bizumHouse2').style.background = ""
      this.services.bizuFloor2 = false
      this.editarService[0].bizuFloor2 = false
    }

    this.validationsFormOfPayment()
  }

  cardFloor2() {
    if (document.getElementById('cardHouse2').style.background == "") {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.cardFloor2 = true
      this.editarService[0].cardFloor2 = true
    } else {
      document.getElementById('cardHouse2').style.background = ""
      this.services.cardFloor2 = false
      this.editarService[0].cardFloor2 = true
    }

    this.validationsFormOfPayment()
  }

  transFloor2() {
    if (document.getElementById('transHouse2').style.background == "") {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transactionFloor2 = true
      this.editarService[0].transactionFloor2 = true
    } else {
      document.getElementById('transHouse2').style.background = ""
      this.services.transactionFloor2 = false
      this.editarService[0].transactionFloor2 = false
    }

    this.validationsFormOfPayment()
  }

  cashFloor2() {
    if (document.getElementById('cashHouse2').style.background == "") {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.cashFloor2 = true
      this.editarService[0].cashFloor2 = true
    } else {
      document.getElementById('cashHouse2').style.background = ""
      this.services.cashFloor2 = false
      this.editarService[0].cashFloor2 = false
    }

    this.validationsFormOfPayment()
  }

  bizumTherapist() {
    if (document.getElementById('bizumTherapist').style.background == "") {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTherapist = true
      this.editarService[0].bizuTherapist = true
    } else {
      document.getElementById('bizumTherapist').style.background = ""
      this.services.bizuTherapist = false
      this.editarService[0].bizuTherapist = false
    }

    this.validationsFormOfPayment()
  }

  cardTherapist() {
    if (document.getElementById('cardTherapist').style.background == "") {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.cardTherapist = true
      this.editarService[0].cardTherapist = false
    } else {
      document.getElementById('cardTherapist').style.background = ""
      this.services.cardTherapist = false
      this.editarService[0].cardTherapist = false
    }

    this.validationsFormOfPayment()
  }

  transTherapist() {
    if (document.getElementById('transTherapist').style.background == "") {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transactionTherapist = true
      this.editarService[0].transactionTherapist = true
    } else {
      document.getElementById('transTherapist').style.background = ""
      this.services.transactionTherapist = false
      this.editarService[0].transactionTherapist = false
    }

    this.validationsFormOfPayment()
  }

  cashTherapist() {
    if (document.getElementById('cashTherapist').style.background == "") {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.cashTherapist = true
      this.editarService[0].cashTherapist = true
    } else {
      document.getElementById('cashTherapist').style.background = ""
      this.services.cashTherapist = false
      this.editarService[0].cashTherapist = false
    }

    this.validationsFormOfPayment()
  }

  bizumManager() {
    if (document.getElementById('bizumManager').style.background == "") {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuManager = true
      this.editarService[0].bizuManager = true
    } else {
      document.getElementById('bizumManager').style.background = ""
      this.services.bizuManager = false
      this.editarService[0].bizuManager = true
    }

    this.validationsFormOfPayment()
  }

  cardManager() {
    if (document.getElementById('cardManager').style.background == "") {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.cardManager = true
      this.editarService[0].cardManager = true
    } else {
      document.getElementById('cardManager').style.background = ""
      this.services.cardManager = false
      this.editarService[0].cardManager = false
    }

    this.validationsFormOfPayment()
  }

  transManager() {
    if (document.getElementById('transManager').style.background == "") {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transactionManager = true
      this.editarService[0].transactionManager = true
    } else {
      document.getElementById('transManager').style.background = ""
      this.services.transactionManager = false
      this.editarService[0].transactionManager = false
    }

    this.validationsFormOfPayment()
  }

  cashManager() {
    if (document.getElementById('cashManager').style.background == "") {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.cashManager = true
      this.editarService[0].cashManager = true
    } else {
      document.getElementById('cashManager').style.background = ""
      this.services.cashManager = false
      this.editarService[0].cashManager = false
    }

    this.validationsFormOfPayment()
  }

  back() {
    this.serviceServices.getById(this.id).subscribe((rp: any) => {
      location.replace(`tabs/${this.idUser}/${rp['service'].screen}`)
    })
  }

  save(idServicio, serv: ModelService) {
    if (this.restamosCobroEdit == 0) {
      if (serv.minutes != null) {
        this.ionLoaderService.simpleLoader()
        if (!this.expiredDateValidationsEdit()) return
        if (!this.validationsToSelectAPaymentMethod()) return
        if (!this.validationsFormOfPayment()) return
        this.fullService()

        if (Boolean(this.editarService[0]['cashFloor1']) == true || Boolean(this.editarService[0]['cashFloor2']) == true ||
          Boolean(this.editarService[0]['cashTherapist']) == true || Boolean(this.editarService[0]['cashManager']) == true ||
          Boolean(this.editarService[0]['efectDriverTaxi']) == true) {
          this.validateEfect = true
          this.efectCheckToggle(this.validateEfect)
        } else {
          localStorage.removeItem('Efectivo')
        }

        if (Boolean(this.editarService[0]['bizuFloor1']) == true || Boolean(this.editarService[0]['bizuFloor2']) == true ||
          Boolean(this.editarService[0]['bizuTherapist']) == true || Boolean(this.editarService[0]['bizuManager']) == true ||
          Boolean(this.editarService[0]['bizuDriverTaxi']) == true) {
          this.validateBizum = true
          this.bizumCheckToggle(this.validateBizum)
        } else {
          localStorage.removeItem('Bizum')
        }

        if (Boolean(this.editarService[0]['cardFloor1']) == true || Boolean(this.editarService[0]['cardFloor2']) == true ||
          Boolean(this.editarService[0]['cardTherapist']) == true || Boolean(this.editarService[0]['cardManager']) == true ||
          Boolean(this.editarService[0]['tarjDriverTaxi']) == true) {
          this.validateTarjeta = true
          this.tarjCheckToggle(this.validateTarjeta)
        } else {
          localStorage.removeItem('Tarjeta')
        }

        if (Boolean(this.editarService[0]['transactionFloor1']) == true || Boolean(this.editarService[0]['transactionFloor2']) == true ||
          Boolean(this.editarService[0]['transactionTherapist']) == true || Boolean(this.editarService[0]['transactionManager']) == true ||
          Boolean(this.editarService[0]['transDriverTaxi']) == true) {
          this.validateTrans = true
          this.transCheckToggle(this.validateTrans)
        } else {
          localStorage.removeItem('Trans')
        }

        this.paymentMethod()
        this.managerAndTherapist()
        this.editValue()

        serv.modifiedBy = this.modifiedUser
        this.therapist.dateEnd = serv.dateEnd
        this.therapist.exit = serv.exit
        this.therapist.minutes = serv.minutes

        this.serviceServices.getById(idServicio).subscribe((rp: any) => {
          this.services.screen = rp['service'].screen
          if (rp['service']['therapist'] != serv.therapist) {
            this.serviceTherapist.updateItems(rp['service']['therapist'], this.therapist).subscribe((rp: any) => { });
          }
        });

        this.serviceTherapist.update3Item(this.editarService[0]['therapist'], this.therapist).subscribe((rp: any) => { })
        this.serviceServices.update(idServicio, serv).subscribe((rp: any) => {
          this.presentController('Actualizado correctamente!')
          setTimeout(() => {
            this.ionLoaderService.dismissLoader()
            location.replace(`tabs/${this.idUser}/${this.services.screen}`)
          }, 1000)
        })
      } else {
        this.presentController('El campo minutos se encuentra vacio')
      }
    } else {
      this.presentController('El total servicio no coincide con el total de cobros')
    }
  }

  delete(id: number) {
    if (this.administratorRole == true) {
      this.serviceServices.getById(id).subscribe((datoEliminado) => {
        if (datoEliminado) {
          Swal.fire({
            heightAuto: false,
            title: '¿Deseas eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Deseo eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.presentController('¡Eliminado Correctamente!')
              this.ionLoaderService.simpleLoader()
              let screen = this.services.screen
              this.serviceTherapist.name(datoEliminado[0]['therapist']).subscribe((rp: any) => {
                this.serviceTherapist.updateItems(rp[0].name, rp[0]).subscribe((rp: any) => { })
              })
              localStorage.removeItem('Efectivo')
              localStorage.removeItem('Bizum')
              localStorage.removeItem('Tarjeta')
              localStorage.removeItem('Trans')
              this.serviceServices.delete(id).subscribe((rp: any) => {
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.idUser}/${screen}`)
              })
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
  }

  async presentController(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'middle',
      cssClass: 'toast-class',
    });
    toast.present();
  }
}