import { Component, OnInit } from '@angular/core';
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
  selector: 'app-edit-services',
  templateUrl: './edit-services.page.html',
  styleUrls: ['./edit-services.page.scss'],
})

export class EditServicesPage implements OnInit {
  hourStartTerapeuta = ''
  horaEndTerapeuta = ''

  fechaActual = ''
  horaStarted = new Date().toTimeString().substring(0, 5)
  fecha = ''
  modifiedUser = ''
  modifiedDate = ''
  horaInicialServicio: string

  idUser: number
  id: number
  manager: any
  terapeuta: any

  fechaLast = []
  administratorRole: boolean = false

  restamosCobroEdit = 0
  sumatoriaCobrosEdit = 0
  idEditar: number
  editarService: ModelService[]

  terapEdit: any
  buttonEdit: any
  buttonDelete = false

  servicioTotal = 0
  validateEfect = false
  validateBizum = false
  validateTarjeta = false
  validateTrans = false

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
    createdBy: "",
    createdTime: "",
    currentDate: "",
    editar: false,
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
    modifiedBy: "",
    modifiedTime: "",
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
    private activeRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private serviceServices: ServiceService,
    private ionLoaderService: IonLoaderService
  ) { }

  ngOnInit() {
    const params = this.activeRoute.snapshot.params
    this.id = Number(params['id'])

    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = param['id']

    if (this.idUser) {
      this.serviceManager.getById(this.idUser).subscribe((rp) => {
        if (rp[0]['rol'] == 'administrador') {
          this.administratorRole = true
          this.getManager()
        } else {
          this.manager = rp
          this.services.encargada = this.manager[0].nombre
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
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
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
    this.services.formaPago = formPago.join(',')
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
        text: 'No se puede crear el servicio por la fecha.',
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
        this.editarService[0]['horaEnd'] = hora + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      } else {
        let minutes = minutos
        this.editarService[0]['horaEnd'] = horas + ':' + (Number(minutes) < 10 ? '0' : '') + minutes
      }
    }
  }

  chosenDate(event: any) {
    this.editarService[0]['fechaHoyInicio'] = event.target.value
    this.fechaActual = event.target.value
  }

  minutes(event: any) {
    let sumarsesion = Number(event.value), horas = 0, minutos = 0, convertHora = '', day = '', month = '', year = ''

    if (event.value === null) sumarsesion = 0

    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.editarService[0]['horaStart'].split(':')

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

    let datesEnd = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))
    datesEnd.setMinutes(datesEnd.getMinutes() + sumarsesion).toString().substring(4, 15)

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

    debugger

    this.editarService[0]['fechaFin'] = `${day}-${month}-${year}`
  }

  validationsFormOfPayment() {
    // Efectivo
    if (Boolean(this.editarService[0]['efectPiso1']) == true && Boolean(this.editarService[0]['bizuPiso1']) == true ||
      Boolean(this.editarService[0]['efectPiso2']) == true && Boolean(this.editarService[0]['bizuPiso2']) == true ||
      Boolean(this.editarService[0]['efectTerap']) == true && Boolean(this.editarService[0]['bizuTerap']) == true ||
      Boolean(this.editarService[0]['efectEncarg']) == true && Boolean(this.editarService[0]['bizuEncarg']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['efectPiso1']) == true && Boolean(this.editarService[0]['tarjPiso1']) == true ||
      Boolean(this.editarService[0]['efectPiso2']) == true && Boolean(this.editarService[0]['tarjPiso2']) == true ||
      Boolean(this.editarService[0]['efectTerap']) == true && Boolean(this.editarService[0]['tarjTerap']) == true ||
      Boolean(this.editarService[0]['efectEncarg']) == true && Boolean(this.editarService[0]['tarjEncarg']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true ||
      Boolean(this.editarService[0]['efectPiso1']) == true && Boolean(this.editarService[0]['transPiso1']) == true ||
      Boolean(this.editarService[0]['efectPiso2']) == true && Boolean(this.editarService[0]['transPiso2']) == true ||
      Boolean(this.editarService[0]['efectTerap']) == true && Boolean(this.editarService[0]['transTerap']) == true ||
      Boolean(this.editarService[0]['efectEncarg']) == true && Boolean(this.editarService[0]['transEncarg']) == true ||
      Boolean(this.editarService[0]['efectDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum
    if (Boolean(this.editarService[0]['bizuPiso1']) == true && Boolean(this.editarService[0]['efectPiso1']) == true ||
      Boolean(this.editarService[0]['bizuPiso2']) == true && Boolean(this.editarService[0]['efectPiso2']) == true ||
      Boolean(this.editarService[0]['bizuTerap']) == true && Boolean(this.editarService[0]['efectTerap']) == true ||
      Boolean(this.editarService[0]['bizuEncarg']) == true && Boolean(this.editarService[0]['efectEncarg']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['bizuPiso1']) == true && Boolean(this.editarService[0]['tarjPiso1']) == true ||
      Boolean(this.editarService[0]['bizuPiso2']) == true && Boolean(this.editarService[0]['tarjPiso2']) == true ||
      Boolean(this.editarService[0]['bizuTerap']) == true && Boolean(this.editarService[0]['tarjTerap']) == true ||
      Boolean(this.editarService[0]['bizuEncarg']) == true && Boolean(this.editarService[0]['tarjEncarg']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true ||
      Boolean(this.editarService[0]['bizuPiso1']) == true && Boolean(this.editarService[0]['transPiso1']) == true ||
      Boolean(this.editarService[0]['bizuPiso2']) == true && Boolean(this.editarService[0]['transPiso2']) == true ||
      Boolean(this.editarService[0]['bizuTerap']) == true && Boolean(this.editarService[0]['transTerap']) == true ||
      Boolean(this.editarService[0]['bizuEncarg']) == true && Boolean(this.editarService[0]['transEncarg']) == true ||
      Boolean(this.editarService[0]['bizuDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta
    if (Boolean(this.editarService[0]['tarjPiso1']) == true && Boolean(this.editarService[0]['efectPiso1']) == true ||
      Boolean(this.editarService[0]['tarjPiso2']) == true && Boolean(this.editarService[0]['efectPiso2']) == true ||
      Boolean(this.editarService[0]['tarjTerap']) == true && Boolean(this.editarService[0]['efectTerap']) == true ||
      Boolean(this.editarService[0]['tarjEncarg']) == true && Boolean(this.editarService[0]['efectEncarg']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['tarjPiso1']) == true && Boolean(this.editarService[0]['bizuPiso1']) == true ||
      Boolean(this.editarService[0]['tarjPiso2']) == true && Boolean(this.editarService[0]['bizuPiso2']) == true ||
      Boolean(this.editarService[0]['tarjTerap']) == true && Boolean(this.editarService[0]['bizuTerap']) == true ||
      Boolean(this.editarService[0]['tarjEncarg']) == true && Boolean(this.editarService[0]['bizuEncarg']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['tarjPiso1']) == true && Boolean(this.editarService[0]['transPiso1']) == true ||
      Boolean(this.editarService[0]['tarjPiso2']) == true && Boolean(this.editarService[0]['transPiso2']) == true ||
      Boolean(this.editarService[0]['tarjTerap']) == true && Boolean(this.editarService[0]['transTerap']) == true ||
      Boolean(this.editarService[0]['tarjEncarg']) == true && Boolean(this.editarService[0]['transEncarg']) == true ||
      Boolean(this.editarService[0]['tarjDriverTaxi']) == true && Boolean(this.editarService[0]['transDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans
    if (Boolean(this.editarService[0]['transPiso1']) == true && Boolean(this.editarService[0]['efectPiso1']) == true ||
      Boolean(this.editarService[0]['transPiso2']) == true && Boolean(this.editarService[0]['efectPiso2']) == true ||
      Boolean(this.editarService[0]['transTerap']) == true && Boolean(this.editarService[0]['efectTerap']) == true ||
      Boolean(this.editarService[0]['transEncarg']) == true && Boolean(this.editarService[0]['efectEncarg']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['efectDriverTaxi']) == true ||
      Boolean(this.editarService[0]['transPiso1']) == true && Boolean(this.editarService[0]['bizuPiso1']) == true ||
      Boolean(this.editarService[0]['transPiso2']) == true && Boolean(this.editarService[0]['bizuPiso2']) == true ||
      Boolean(this.editarService[0]['transTerap']) == true && Boolean(this.editarService[0]['bizuTerap']) == true ||
      Boolean(this.editarService[0]['transEncarg']) == true && Boolean(this.editarService[0]['bizuEncarg']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['bizuDriverTaxi']) == true ||
      Boolean(this.editarService[0]['transPiso1']) == true && Boolean(this.editarService[0]['tarjPiso1']) == true ||
      Boolean(this.editarService[0]['transPiso2']) == true && Boolean(this.editarService[0]['tarjPiso2']) == true ||
      Boolean(this.editarService[0]['transTerap']) == true && Boolean(this.editarService[0]['tarjTerap']) == true ||
      Boolean(this.editarService[0]['transEncarg']) == true && Boolean(this.editarService[0]['tarjEncarg']) == true ||
      Boolean(this.editarService[0]['transDriverTaxi']) == true && Boolean(this.editarService[0]['tarjDriverTaxi']) == true) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validationsToSelectAPaymentMethod() {

    if (Number(this.editarService[0]['numberPiso1']) > 0 && Boolean(this.editarService[0]['efectPiso1']) == false &&
      Boolean(this.editarService[0]['bizuPiso1']) == false && Boolean(this.editarService[0]['tarjPiso1']) == false &&
      Boolean(this.editarService[0]['transPiso1']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.editarService[0]['numberPiso2']) > 0 && Boolean(this.editarService[0]['efectPiso2']) == false &&
      Boolean(this.editarService[0]['bizuPiso2']) == false && Boolean(this.editarService[0]['tarjPiso2']) == false &&
      Boolean(this.editarService[0]['transPiso2']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.editarService[0]['numberTerap']) > 0 && Boolean(this.editarService[0]['efectTerap']) == false &&
      Boolean(this.editarService[0]['bizuTerap']) == false && Boolean(this.editarService[0]['tarjTerap']) == false &&
      Boolean(this.editarService[0]['transTerap']) == false) {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.editarService[0]['numberEncarg']) > 0 && Boolean(this.editarService[0]['efectEncarg']) == false &&
      Boolean(this.editarService[0]['bizuEncarg']) == false && Boolean(this.editarService[0]['tarjEncarg']) == false &&
      Boolean(this.editarService[0]['transEncarg']) == false) {
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

  sortDateToEdit() {
    let dia = '', mes = '', año = ''

    dia = this.editarService[0]['fecha'].substring(8, 10)
    mes = this.editarService[0]['fecha'].substring(5, 7)
    año = this.editarService[0]['fecha'].substring(2, 4)

    this.editarService[0]['fecha'] = `${dia}-${mes}-${año}`
  }

  SetTheValuesToEmpty() {
    if (this.editarService[0]['servicio'] == '0') this.editarService[0]['servicio'] = ''
    if (this.editarService[0]['bebidas'] == '0') this.editarService[0]['bebidas'] = ''
    if (this.editarService[0]['bebidaTerap'] == '0') this.editarService[0]['bebidaTerap'] = ''
    if (this.editarService[0]['tabaco'] == '0') this.editarService[0]['tabaco'] = ''
    if (this.editarService[0]['taxi'] == '0') this.editarService[0]['taxi'] = ''
    if (this.editarService[0]['vitaminas'] == '0') this.editarService[0]['vitaminas'] = ''
    if (this.editarService[0]['propina'] == '0') this.editarService[0]['propina'] = ''
    if (this.editarService[0]['otros'] == '0') this.editarService[0]['otros'] = ''
    if (this.editarService[0]['numberPiso1'] == '0') this.editarService[0]['numberPiso1'] = ''
    if (this.editarService[0]['numberPiso2'] == '0') this.editarService[0]['numberPiso2'] = ''
    if (this.editarService[0]['numberTerap'] == '0') this.editarService[0]['numberTerap'] = ''
    if (this.editarService[0]['numberEncarg'] == '0') this.editarService[0]['numberEncarg'] = ''
    if (this.editarService[0]['numberTaxi'] == '0') this.editarService[0]['numberTaxi'] = ''
  }

  editForm() {
    let fecha = new Date(), dia = '', mes = '', año = 0
    año = fecha.getFullYear()

    this.serviceServices.getByEditar(this.id).subscribe((datosServicio: any) => {
      if (datosServicio.length > 0) {
        this.editarService = datosServicio
        this.fecha = datosServicio[0]['fecha']
        this.fechaActual = datosServicio[0]['fechaHoyInicio']
        this.SetTheValuesToEmpty()

        this.hourStartTerapeuta = datosServicio[0]['horaStart']
        this.horaEndTerapeuta = datosServicio[0]['horaEnd']

        // Fechas
        dia = this.editarService[0].fecha.substring(0, 2)
        mes = this.editarService[0].fecha.substring(3, 5)
        this.editarService[0].fecha = `${año}-${mes}-${dia}`

        this.collectionsValue()

        this.serviceManager.getByIdAndAdministrador(this.idUser).subscribe((datoAdministrador: any[]) => {
          if (datoAdministrador.length > 0) {
            this.modified(datoAdministrador)
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
        this.serviceManager.getById(this.idUser).subscribe((datoUser: any[]) => {
          this.idUser = datoUser[0]
        })
      }
    })
  }

  modified(rp: any) {

    this.modifiedUser = rp[0]['nombre']

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    this.modifiedDate = date + ' ' + time;
  }

  fullService() {
    let piso1 = 0, piso2 = 0, terap = 0, encargada = 0, otros = 0

    if (Number(this.editarService[0]['numberPiso1']) === 0) {
      piso1 = 0
      this.editarService[0]['numberPiso1'] = "0"
    } else {
      piso1 = Number(this.editarService[0]['numberPiso1'])
    }

    if (Number(this.editarService[0]['numberPiso2']) == 0) {
      piso2 = 0
      this.editarService[0]['numberPiso2'] = "0"
    } else {
      piso2 = Number(this.editarService[0]['numberPiso2'])
    }

    if (Number(this.editarService[0]['numberTerap']) == 0) {
      terap = 0
      this.editarService[0]['numberTerap'] = "0"
    } else {
      terap = Number(this.editarService[0]['numberTerap'])
    }

    if (Number(this.editarService[0]['numberEncarg']) == 0) {
      encargada = 0
      this.editarService[0]['numberEncarg'] = "0"
    } else {
      encargada = Number(this.editarService[0]['numberEncarg'])
    }

    if (Number(this.editarService[0]['numberTaxi']) == 0) {
      otros = 0
      this.editarService[0]['numberTaxi'] = "0"
    } else {
      otros = Number(this.editarService[0]['numberTaxi'])
    }

    this.servicioTotal = Number(piso1 + piso2 + terap + encargada + otros)

    if (Number(this.editarService[0]['servicio']) == 0) {
      otros = 0
      this.editarService[0]['servicio'] = "0"
    } else {
      otros = Number(this.editarService[0]['servicio'])
    }

    if (Number(this.editarService[0]['bebidas']) == 0) {
      otros = 0
      this.editarService[0]['bebidas'] = "0"
    } else {
      otros = Number(this.editarService[0]['bebidas'])
    }

    if (Number(this.editarService[0]['bebidaTerap']) == 0) {
      otros = 0
      this.editarService[0]['bebidaTerap'] = "0"
    } else {
      otros = Number(this.editarService[0]['bebidaTerap'])
    }

    if (Number(this.editarService[0]['tabaco']) == 0) {
      otros = 0
      this.editarService[0]['tabaco'] = "0"
    } else {
      otros = Number(this.editarService[0]['tabaco'])
    }

    if (Number(this.editarService[0]['taxi']) == 0) {
      otros = 0
      this.editarService[0]['taxi'] = "0"
    } else {
      otros = Number(this.editarService[0]['taxi'])
    }

    if (Number(this.editarService[0]['vitaminas']) == 0) {
      otros = 0
      this.editarService[0]['vitaminas'] = "0"
    } else {
      otros = Number(this.editarService[0]['vitaminas'])
    }

    if (Number(this.editarService[0]['propina']) == 0) {
      otros = 0
      this.editarService[0]['propina'] = "0"
    } else {
      otros = Number(this.editarService[0]['propina'])
    }

    if (Number(this.editarService[0]['otros']) == 0) {
      otros = 0
      this.editarService[0]['otros'] = "0"
    } else {
      otros = Number(this.editarService[0]['otros'])
    }
  }

  serviceValue() {
    let servicioEdit = 0, bebidaEdit = 0, bebidaTerapEdit = 0, tabacoEdit = 0, taxiEdit = 0, vitaminasEdit = 0, propinaEdit = 0, otrosEdit = 0, sumatoriaEdit = 0

    if (Number(this.editarService[0]['servicio']) > 0) {
      servicioEdit = Number(this.editarService[0]['servicio'])
    } else {
      servicioEdit = 0
    }

    if (Number(this.editarService[0]['bebidas']) > 0) {
      bebidaEdit = Number(this.editarService[0]['bebidas'])
    } else {
      bebidaEdit = 0
    }

    if (Number(this.editarService[0]['bebidaTerap']) > 0) {
      bebidaTerapEdit = Number(this.editarService[0]['bebidaTerap'])
    } else {
      bebidaTerapEdit = 0
    }

    if (Number(this.editarService[0]['tabaco']) > 0) {
      tabacoEdit = Number(this.editarService[0]['tabaco'])
    } else {
      tabacoEdit = 0
    }

    if (Number(this.editarService[0]['taxi']) > 0) {
      taxiEdit = Number(this.editarService[0]['taxi'])
    } else {
      taxiEdit = 0
    }

    if (Number(this.editarService[0]['vitaminas']) > 0) {
      vitaminasEdit = Number(this.editarService[0]['vitaminas'])
    } else {
      vitaminasEdit = 0
    }

    if (Number(this.editarService[0]['propina']) > 0) {
      propinaEdit = Number(this.editarService[0]['propina'])
    } else {
      propinaEdit = 0
    }

    if (Number(this.editarService[0]['otros']) > 0) {
      otrosEdit = Number(this.editarService[0]['otros'])
    } else {
      otrosEdit = 0
    }

    sumatoriaEdit = servicioEdit + propinaEdit + taxiEdit + vitaminasEdit + tabacoEdit + otrosEdit + bebidaEdit + bebidaTerapEdit
    this.editarService[0]['totalServicio'] = sumatoriaEdit
    this.restamosCobroEdit = sumatoriaEdit

    const restamosEdit = Number(this.editarService[0]['numberPiso1']) + Number(this.editarService[0]['numberPiso2']) + Number(this.editarService[0]['numberTerap']) +
      Number(this.editarService[0]['numberEncarg']) + Number(this.editarService[0]['numberTaxi'])

    if (Number(this.editarService[0]['numberPiso1']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberPiso2']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTerap']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberEncarg']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }

    if (Number(this.editarService[0]['numberTaxi']) > 0) {
      this.restamosCobroEdit = sumatoriaEdit - restamosEdit
    }
  }

  collectionsValue() {
    let valuepiso1Edit = 0, valuepiso2Edit = 0, valueterapeutaEdit = 0, valueEncargEdit = 0, valueotrosEdit = 0, restamosEdit = 0, resultadoEdit = 0

    if (Number(this.editarService[0]['numberPiso1']) > 0) {
      valuepiso1Edit = Number(this.editarService[0]['numberPiso1'])
    } else {
      valuepiso1Edit = 0
    }

    if (Number(this.editarService[0]['numberPiso2']) > 0) {
      valuepiso2Edit = Number(this.editarService[0]['numberPiso2'])
    } else {
      valuepiso2Edit = 0
    }

    if (Number(this.editarService[0]['numberTerap']) > 0) {
      valueterapeutaEdit = Number(this.editarService[0]['numberTerap'])
    } else {
      valueterapeutaEdit = 0
    }

    if (Number(this.editarService[0]['numberEncarg']) > 0) {
      valueEncargEdit = Number(this.editarService[0]['numberEncarg'])
    } else {
      valueEncargEdit = 0
    }

    if (Number(this.editarService[0]['numberTaxi']) > 0) {
      valueotrosEdit = Number(this.editarService[0]['numberTaxi'])
    } else {
      valueotrosEdit = 0
    }

    if (this.editarService[0]['totalServicio'] > 0) {
      resultadoEdit = Number(this.editarService[0]['totalServicio']) - valuepiso1Edit
    }

    this.sumatoriaCobrosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit

    restamosEdit = valuepiso1Edit + valuepiso2Edit + valueterapeutaEdit + valueEncargEdit + valueotrosEdit
    resultadoEdit = this.sumatoriaCobrosEdit - restamosEdit
    this.restamosCobroEdit = resultadoEdit
  }

  validateCheck() {

    // Cash
    if (Boolean(this.editarService[0]['efectPiso1']) === true) {
      document.getElementById("cashHouse1").style.background = '#1fb996'
      this.services.efectPiso1 = true
    }

    if (Boolean(this.editarService[0]['efectPiso2']) === true) {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.efectPiso2 = true
    }

    if (Boolean(this.editarService[0]['efectTerap']) === true) {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.efectTerap = true
    }

    if (Boolean(this.editarService[0]['efectEncarg']) === true) {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.efectEncarg = true
    }

    // Bizum

    if (Boolean(this.editarService[0].bizuPiso1) == true) {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuPiso1 = true
    }

    if (Boolean(this.editarService[0].bizuPiso2) == true) {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuPiso2 = true
    }

    if (Boolean(this.editarService[0].bizuTerap) == true) {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTerap = true
    }

    if (Boolean(this.editarService[0].bizuEncarg) == true) {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuEncarg = true
    }

    // Card 

    if (Boolean(this.editarService[0].tarjPiso1) == true) {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.tarjPiso1 = true
    }

    if (Boolean(this.editarService[0].tarjPiso2) == true) {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.tarjPiso2 = true
    }

    if (Boolean(this.editarService[0].tarjTerap) == true) {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.tarjTerap = true
    }

    if (Boolean(this.editarService[0].tarjEncarg) == true) {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.tarjEncarg = true
    }

    // Trans

    if (Boolean(this.editarService[0].transPiso1) == true) {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transPiso1 = true
    }

    if (Boolean(this.editarService[0].transPiso2) == true) {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transPiso2 = true
    }

    if (Boolean(this.editarService[0].transTerap) == true) {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transTerap = true
    }

    if (Boolean(this.editarService[0].transEncarg) == true) {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transEncarg = true
    }
  }

  efectCheckToggle(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroserv = 0, suma = 0
    if (!this.validationsFormOfPayment()) return

    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && Boolean(this.editarService[0]['efectPiso1']) === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Efectivo'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && Boolean(this.editarService[0]['efectPiso2']) === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Efectivo'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && Boolean(this.editarService[0]['efectTerap']) === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && Boolean(this.editarService[0]['efectEncarg']) === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && Boolean(this.editarService[0]['bizuPiso1']) === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Bizum'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && Boolean(this.editarService[0]['bizuPiso2']) === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Bizum'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && Boolean(this.editarService[0]['bizuTerap']) === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && Boolean(this.editarService[0]['bizuEncarg']) === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && Boolean(this.editarService[0]['tarjPiso1']) === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Tarjeta'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && Boolean(this.editarService[0]['tarjPiso2']) === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Tarjeta'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && Boolean(this.editarService[0]['tarjTerap']) === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && Boolean(this.editarService[0]['tarjEncarg']) === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
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

      if (Number(this.editarService[0]['numberPiso1']) > 0 && Boolean(this.editarService[0]['transPiso1']) === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Transaccion'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && Boolean(this.editarService[0]['transPiso2']) === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Transaccion'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && Boolean(this.editarService[0]['transTerap']) === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && Boolean(this.editarService[0]['transEncarg']) === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
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
    if (Boolean(this.editarService[0]['efectPiso1']) == true) this.editarService[0]['valuePiso1Efectivo'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Efectivo'] = 0

    if (Boolean(this.editarService[0]['efectPiso2']) == true) this.editarService[0]['valuePiso2Efectivo'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Efectivo'] = 0

    if (Boolean(this.editarService[0]['bizuPiso1']) == true) this.editarService[0]['valuePiso1Bizum'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Bizum'] = 0

    if (Boolean(this.editarService[0]['bizuPiso2']) == true) this.editarService[0]['valuePiso2Bizum'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Bizum'] = 0

    if (Boolean(this.editarService[0]['tarjPiso1']) == true) this.editarService[0]['valuePiso1Tarjeta'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Tarjeta'] = 0

    if (Boolean(this.editarService[0]['tarjPiso2']) == true) this.editarService[0]['valuePiso2Tarjeta'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Tarjeta'] = 0

    if (Boolean(this.editarService[0]['transPiso1']) == true) this.editarService[0]['valuePiso1Transaccion'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Transaccion'] = 0

    if (Boolean(this.editarService[0]['transPiso2']) == true) this.editarService[0]['valuePiso2Transaccion'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Transaccion'] = 0
  }

  managerAndTherapist() {

    if (Boolean(this.editarService[0]['efectTerap']) == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueEfectTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueEfectTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['bizuTerap']) == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueBizuTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueBizuTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['tarjTerap']) == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTarjeTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTarjeTerapeuta'] = 0
    }

    if (Boolean(this.editarService[0]['transTerap']) == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTransTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTransTerapeuta'] = 0
    }

    // Encargada

    if (Boolean(this.editarService[0]['efectEncarg']) == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueEfectEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueEfectEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['bizuEncarg']) == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueBizuEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueBizuEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['tarjEncarg']) == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTarjeEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTarjeEncargada'] = 0
    }

    if (Boolean(this.editarService[0]['transEncarg']) == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTransEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTransEncargada'] = 0
    }
  }

  bizumFloor1() {
    if (document.getElementById('bizumHouse1').style.background == "") {
      document.getElementById('bizumHouse1').style.background = '#1fb996'
      this.services.bizuPiso1 = true
      this.editarService[0].bizuPiso1 = true
    } else {
      document.getElementById('bizumHouse1').style.background = ""
      this.services.bizuPiso1 = false
      this.editarService[0].bizuPiso1 = false
    }

    this.validationsFormOfPayment()
  }

  cardFloor1() {
    if (document.getElementById('cardHouse1').style.background == "") {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.tarjPiso1 = true
      this.editarService[0].tarjPiso1 = true
    } else {
      document.getElementById('cardHouse1').style.background = ""
      this.services.tarjPiso1 = false
      this.editarService[0].tarjPiso1 = false
    }

    this.validationsFormOfPayment()
  }

  transFloor1() {
    if (document.getElementById('transHouse1').style.background == "") {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transPiso1 = true
      this.editarService[0].transPiso1 = true
    } else {
      document.getElementById('transHouse1').style.background = ""
      this.services.transPiso1 = false
      this.editarService[0].transPiso1 = false
    }

    this.validationsFormOfPayment()
  }

  cashFloor1() {
    if (document.getElementById('cashHouse1').style.background == "") {
      document.getElementById('cashHouse1').style.background = '#1fb996'
      this.services.efectPiso1 = true
      this.editarService[0].efectPiso1 = true
    } else {
      document.getElementById('cashHouse1').style.background = ""
      this.services.efectPiso1 = false
      this.editarService[0].efectPiso1 = false
    }

    this.validationsFormOfPayment()
  }

  bizumFloor2() {
    if (document.getElementById('bizumHouse2').style.background == "") {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuPiso2 = true
      this.editarService[0].bizuPiso2 = true
    } else {
      document.getElementById('bizumHouse2').style.background = ""
      this.services.bizuPiso2 = false
      this.editarService[0].bizuPiso2 = false
    }

    this.validationsFormOfPayment()
  }

  cardFloor2() {
    if (document.getElementById('cardHouse2').style.background == "") {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.tarjPiso2 = true
      this.editarService[0].tarjPiso2 = true
    } else {
      document.getElementById('cardHouse2').style.background = ""
      this.services.tarjPiso2 = false
      this.editarService[0].tarjPiso2 = true
    }

    this.validationsFormOfPayment()
  }

  transFloor2() {
    if (document.getElementById('transHouse2').style.background == "") {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transPiso2 = true
      this.editarService[0].transPiso2 = true
    } else {
      document.getElementById('transHouse2').style.background = ""
      this.services.transPiso2 = false
      this.editarService[0].transPiso2 = false
    }

    this.validationsFormOfPayment()
  }

  cashFloor2() {
    if (document.getElementById('cashHouse2').style.background == "") {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.efectPiso2 = true
      this.editarService[0].efectPiso2 = true
    } else {
      document.getElementById('cashHouse2').style.background = ""
      this.services.efectPiso2 = false
      this.editarService[0].efectPiso2 = false
    }

    this.validationsFormOfPayment()
  }

  bizumTherapist() {
    if (document.getElementById('bizumTherapist').style.background == "") {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTerap = true
      this.editarService[0].bizuTerap = true
    } else {
      document.getElementById('bizumTherapist').style.background = ""
      this.services.bizuTerap = false
      this.editarService[0].bizuTerap = false
    }

    this.validationsFormOfPayment()
  }

  cardTherapist() {
    if (document.getElementById('cardTherapist').style.background == "") {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.tarjTerap = true
      this.editarService[0].tarjTerap = false
    } else {
      document.getElementById('cardTherapist').style.background = ""
      this.services.tarjTerap = false
      this.editarService[0].tarjTerap = false
    }

    this.validationsFormOfPayment()
  }

  transTherapist() {
    if (document.getElementById('transTherapist').style.background == "") {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transTerap = true
      this.editarService[0].transTerap = true
    } else {
      document.getElementById('transTherapist').style.background = ""
      this.services.transTerap = false
      this.editarService[0].transTerap = false
    }

    this.validationsFormOfPayment()
  }

  cashTherapist() {
    if (document.getElementById('cashTherapist').style.background == "") {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.efectTerap = true
      this.editarService[0].efectTerap = true
    } else {
      document.getElementById('cashTherapist').style.background = ""
      this.services.efectTerap = false
      this.editarService[0].efectTerap = false
    }

    this.validationsFormOfPayment()
  }

  bizumManager() {
    if (document.getElementById('bizumManager').style.background == "") {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuEncarg = true
      this.editarService[0].bizuEncarg = true
    } else {
      document.getElementById('bizumManager').style.background = ""
      this.services.bizuEncarg = false
      this.editarService[0].bizuEncarg = true
    }

    this.validationsFormOfPayment()
  }

  cardManager() {
    if (document.getElementById('cardManager').style.background == "") {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.tarjEncarg = true
      this.editarService[0].tarjEncarg = true
    } else {
      document.getElementById('cardManager').style.background = ""
      this.services.tarjEncarg = false
      this.editarService[0].tarjEncarg = false
    }

    this.validationsFormOfPayment()
  }

  transManager() {
    if (document.getElementById('transManager').style.background == "") {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transEncarg = true
      this.editarService[0].transEncarg = true
    } else {
      document.getElementById('transManager').style.background = ""
      this.services.transEncarg = false
      this.editarService[0].transEncarg = false
    }

    this.validationsFormOfPayment()
  }

  cashManager() {
    if (document.getElementById('cashManager').style.background == "") {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.efectEncarg = true
      this.editarService[0].efectEncarg = true
    } else {
      document.getElementById('cashManager').style.background = ""
      this.services.efectEncarg = false
      this.editarService[0].efectEncarg = false
    }

    this.validationsFormOfPayment()
  }

  back() {
    this.serviceServices.getById(this.id).subscribe((rp: any) => {
      location.replace(`tabs/${this.idUser}/${rp[0].pantalla}`)
    })
  }

  save(idServicio, serv: ModelService) {
    if (this.restamosCobroEdit == 0) {
      if (serv.minuto != null) {
        this.ionLoaderService.simpleLoader()
        if (!this.expiredDateValidationsEdit()) return
        if (!this.validationsToSelectAPaymentMethod()) return
        if (!this.validationsFormOfPayment()) return
        this.fullService()

        if (Boolean(this.editarService[0]['efectPiso1']) == true || Boolean(this.editarService[0]['efectPiso2']) == true ||
          Boolean(this.editarService[0]['efectTerap']) == true || Boolean(this.editarService[0]['efectEncarg']) == true ||
          Boolean(this.editarService[0]['efectDriverTaxi']) == true) {
          this.validateEfect = true
          this.efectCheckToggle(this.validateEfect)
        } else {
          localStorage.removeItem('Efectivo')
        }

        if (Boolean(this.editarService[0]['bizuPiso1']) == true || Boolean(this.editarService[0]['bizuPiso2']) == true ||
          Boolean(this.editarService[0]['bizuTerap']) == true || Boolean(this.editarService[0]['bizuEncarg']) == true ||
          Boolean(this.editarService[0]['bizuDriverTaxi']) == true) {
          this.validateBizum = true
          this.bizumCheckToggle(this.validateBizum)
        } else {
          localStorage.removeItem('Bizum')
        }

        if (Boolean(this.editarService[0]['tarjPiso1']) == true || Boolean(this.editarService[0]['tarjPiso2']) == true ||
          Boolean(this.editarService[0]['tarjTerap']) == true || Boolean(this.editarService[0]['tarjEncarg']) == true ||
          Boolean(this.editarService[0]['tarjDriverTaxi']) == true) {
          this.validateTarjeta = true
          this.tarjCheckToggle(this.validateTarjeta)
        } else {
          localStorage.removeItem('Tarjeta')
        }

        if (Boolean(this.editarService[0]['transPiso1']) == true || Boolean(this.editarService[0]['transPiso2']) == true ||
          Boolean(this.editarService[0]['transTerap']) == true || Boolean(this.editarService[0]['transEncarg']) == true ||
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
        serv.modifiedTime = this.modifiedDate
        serv.fechaFin = this.editarService[0]['fechaFin']
        serv.horaEnd = this.editarService[0]['horaEnd']

        this.therapist.horaEnd = serv.horaEnd
        this.therapist.fechaEnd = serv.fechaFin
        this.therapist.salida = serv.salida
        this.therapist.minuto = serv.minuto

        debugger

        this.serviceServices.getById(idServicio).subscribe((rp: any) => {
          this.services.pantalla = rp[0].pantalla
          if (rp[0]['terapeuta'] != serv.terapeuta) {
            this.serviceTherapist.updateHoraAndSalida(rp[0]['terapeuta'], this.therapist).subscribe((rp: any) => { });
          }
        });

        this.serviceTherapist.update(this.editarService[0]['terapeuta'], this.therapist).subscribe((rp: any) => { })

        this.sortDateToEdit()
        this.serviceServices.updateServicio(idServicio, serv).subscribe((rp: any) => {
          setTimeout(() => {
            this.ionLoaderService.dismissLoader()
            location.replace(`tabs/${this.idUser}/${this.services.pantalla}`)
            Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500 })
          }, 1000)
        })
      } else {
        Swal.fire({ heightAuto: false, icon: 'error', title: 'Oops...', text: 'El campo minutos se encuentra vacio', showConfirmButton: false, timer: 2500 })
      }
    } else {
      Swal.fire({ heightAuto: false, icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
    }
  }

  delete(id) {
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
              this.ionLoaderService.simpleLoader()
              let screen = this.services.pantalla
              this.serviceTherapist.getTerapeuta(datoEliminado[0]['terapeuta']).subscribe((rp: any) => {
                this.serviceTherapist.updateHoraAndSalida(rp[0].nombre, rp[0]).subscribe((rp: any) => { })
              })
              localStorage.removeItem('Efectivo')
              localStorage.removeItem('Bizum')
              localStorage.removeItem('Tarjeta')
              localStorage.removeItem('Trans')
              this.serviceServices.deleteServicio(id).subscribe((rp: any) => {
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.idUser}/${screen}`)
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
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
}