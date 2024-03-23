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

  // Editar
  restamosCobroEdit = 0
  sumatoriaCobrosEdit = 0

  idEditar: number
  editarService: ModelService[]
  editamos = false
  idUserAdministrador: number
  idUser: number
  buttonDelete = false

  idUnico: string

  terapEdit: any
  terapeutaSelect: any
  addService = false
  Servminutes = ""
  buttonSave: any
  buttonEdit: any

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
    private activatedRoute: ActivatedRoute,    
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService,
    private serviceServices: ServiceService,
    private ionLoaderService: IonLoaderService
  ) {
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = params['id']

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

  // isDisabled(date: NgbDateStruct, current: { month: number }) {
  //   return date.month !== current.month
  // }

  changeFecha(event) {
    this.chageDate = event.target.value.substring(5, 10)
  }

  expiredDateValidations() {
    this.buttonSave = document.getElementById('btnSave') as HTMLButtonElement
    this.buttonSave.disabled = true;

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
      this.buttonSave.disabled = false;
      Swal.fire({
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
    }
  }

  cardFloor1() {
    if (document.getElementById('cardHouse1').style.background == "") {
      document.getElementById('cardHouse1').style.background = '#1fb996'
      this.services.tarjPiso1 = true
    } else {
      document.getElementById('cardHouse1').style.background = ""
      this.services.tarjPiso1 = false
    }

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
    }
  }

  transFloor1() {
    if (document.getElementById('transHouse1').style.background == "") {
      document.getElementById('transHouse1').style.background = '#1fb996'
      this.services.transPiso1 = true
    } else {
      document.getElementById('transHouse1').style.background = ""
      this.services.transPiso1 = false
    }

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
    }
  }

  cashFloor1() {
    if (document.getElementById('cashHouse1').style.background == "") {
      document.getElementById('cashHouse1').style.background = '#1fb996'
      this.services.efectPiso1 = true
    } else {
      document.getElementById('cashHouse1').style.background = ""
      this.services.efectPiso1 = false
    }

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
    }
  }

  bizumFloor2() {
    if (document.getElementById('bizumHouse2').style.background == "") {
      document.getElementById('bizumHouse2').style.background = '#1fb996'
      this.services.bizuPiso2 = true
    } else {
      document.getElementById('bizumHouse2').style.background = ""
      this.services.bizuPiso2 = false
    }

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
    }
  }

  cardFloor2() {
    if (document.getElementById('cardHouse2').style.background == "") {
      document.getElementById('cardHouse2').style.background = '#1fb996'
      this.services.tarjPiso2 = true
    } else {
      document.getElementById('cardHouse2').style.background = ""
      this.services.tarjPiso2 = false
    }

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
    }
  }

  transFloor2() {
    if (document.getElementById('transHouse2').style.background == "") {
      document.getElementById('transHouse2').style.background = '#1fb996'
      this.services.transPiso2 = true
    } else {
      document.getElementById('transHouse2').style.background = ""
      this.services.transPiso2 = false
    }

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
    }
  }

  cashFloor2() {
    if (document.getElementById('cashHouse2').style.background == "") {
      document.getElementById('cashHouse2').style.background = '#1fb996'
      this.services.efectPiso2 = true
    } else {
      document.getElementById('cashHouse2').style.background = ""
      this.services.efectPiso2 = false
    }

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
    }
  }

  bizumTherapist() {
    if (document.getElementById('bizumTherapist').style.background == "") {
      document.getElementById('bizumTherapist').style.background = '#1fb996'
      this.services.bizuTerap = true
    } else {
      document.getElementById('bizumTherapist').style.background = ""
      this.services.bizuTerap = false
    }

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
    }
  }

  cardTherapist() {
    if (document.getElementById('cardTherapist').style.background == "") {
      document.getElementById('cardTherapist').style.background = '#1fb996'
      this.services.tarjTerap = true
    } else {
      document.getElementById('cardTherapist').style.background = ""
      this.services.tarjTerap = false
    }

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
    }
  }

  transTherapist() {
    if (document.getElementById('transTherapist').style.background == "") {
      document.getElementById('transTherapist').style.background = '#1fb996'
      this.services.transTerap = true
    } else {
      document.getElementById('transTherapist').style.background = ""
      this.services.transTerap = false
    }

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
    }
  }

  cashTherapist() {
    if (document.getElementById('cashTherapist').style.background == "") {
      document.getElementById('cashTherapist').style.background = '#1fb996'
      this.services.efectTerap = true
    } else {
      document.getElementById('cashTherapist').style.background = ""
      this.services.efectTerap = false
    }

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
    }
  }

  bizumManager() {
    if (document.getElementById('bizumManager').style.background == "") {
      document.getElementById('bizumManager').style.background = '#1fb996'
      this.services.bizuEncarg = true
    } else {
      document.getElementById('bizumManager').style.background = ""
      this.services.bizuEncarg = false
    }

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
    }
  }

  cardManager() {
    if (document.getElementById('cardManager').style.background == "") {
      document.getElementById('cardManager').style.background = '#1fb996'
      this.services.tarjEncarg = true
    } else {
      document.getElementById('cardManager').style.background = ""
      this.services.tarjEncarg = false
    }

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
    }
  }

  transManager() {
    if (document.getElementById('transManager').style.background == "") {
      document.getElementById('transManager').style.background = '#1fb996'
      this.services.transEncarg = true
    } else {
      document.getElementById('transManager').style.background = ""
      this.services.transEncarg = false
    }

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
    }
  }

  cashManager() {
    if (document.getElementById('cashManager').style.background == "") {
      document.getElementById('cashManager').style.background = '#1fb996'
      this.services.efectEncarg = true
    } else {
      document.getElementById('cashManager').style.background = ""
      this.services.efectEncarg = false
    }

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
    }
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
                    this.idUser = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
                    this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
                    Swal.fire({ position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1500 })
                  }, 1000)
                }
              })
            }
            else {
              this.buttonSave.disabled = false
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
            }
          } else {
            this.buttonSave.disabled = false
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo minutos se encuentra vacio', showConfirmButton: false, timer: 2500 })
          }
        } else {
          this.buttonSave.disabled = false
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo tratamiento se encuentra vacio', showConfirmButton: false, timer: 2500 })
        }
      } else {
        this.buttonSave.disabled = false
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'No hay ninguna encargada seleccionada', showConfirmButton: false, timer: 2500 })
      }
    } else {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No hay ninguna terapeuta seleccionada', showConfirmButton: false, timer: 2500 })
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

  editPaymentMethod(): void {
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

  editChosenDate(event: any) {
    this.editarService[0]['fechaHoyInicio'] = event.target.value
    this.fechaActual = event.target.value
  }

  minutes(event: any) {
    this.services.minuto = event
    let sumarsesion = event, horas = 0, minutos = 0, convertHora = '', day = '', month = '', year = ''
    if (event === null) sumarsesion = 0

    // Create date by Date and Hour
    const splitDate = this.fechaActual.toString().split('-')
    const splitHour = this.horaInicialServicio.split(':')

    let defineDate = new Date(Number(splitDate[0]), (Number(splitDate[1]) - 1), Number(splitDate[2]), Number(splitHour[0]), Number(splitHour[1]))
    defineDate.setMinutes(defineDate.getMinutes() + sumarsesion)

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
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
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
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
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
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
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
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  paymentMethodValidation() {
    if (Number(this.services.numberPiso1) > 0 && this.services.efectPiso1 == false && this.services.bizuPiso1 == false &&
      this.services.tarjPiso1 == false && this.services.transPiso1 == false) {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.services.numberPiso2) > 0 && this.services.efectPiso2 == false && this.services.bizuPiso2 == false &&
      this.services.tarjPiso2 == false && this.services.transPiso2 == false) {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.services.numberTerap) > 0 && this.services.efectTerap == false && this.services.bizuTerap == false &&
      this.services.tarjTerap == false && this.services.transTerap == false) {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.services.numberEncarg) > 0 && this.services.efectEncarg == false && this.services.bizuEncarg == false &&
      this.services.tarjEncarg == false && this.services.transEncarg == false) {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.services.numberTaxi) > 0 && this.services.efectDriverTaxi == false && this.services.bizuDriverTaxi == false &&
      this.services.tarjDriverTaxi == false && this.services.transDriverTaxi == false) {
      this.buttonSave.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para taxista' })
      return false
    }
    return true
  }

  // -------------------------------------------- Editamos  // ---------------------------------------------

  expiredDateValidationsEdit() {
    this.buttonSave = document.getElementById('btnEdit') as HTMLButtonElement
    this.buttonSave.disabled = true;

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
      this.buttonSave.disabled = false;
      Swal.fire({
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

  editStartTime(event: any) {
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

  editMinutes(event: any) {

    let sumarsesion = event, horas = 0, minutos = 0, convertHora = '', day = '', month = '', year = ''

    if (event === null) sumarsesion = 0

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

    this.editarService[0]['fechaFin'] = `${day}-${month}-${year}`
  }

  validationsFormOfPaymentToEdit() {
    // Efectivo Editar
    if (this.editarService[0]['efectPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['efectDriverTaxi'] == true && this.editarService[0]['bizuDriverTaxi'] == true ||
      this.editarService[0]['efectPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['efectDriverTaxi'] == true && this.editarService[0]['tarjDriverTaxi'] == true ||
      this.editarService[0]['efectPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['efectPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['efectTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['efectEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['efectDriverTaxi'] == true && this.editarService[0]['transDriverTaxi'] == true) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Bizum Editar
    if (this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['bizuDriverTaxi'] == true && this.editarService[0]['efectDriverTaxi'] == true ||
      this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['bizuDriverTaxi'] == true && this.editarService[0]['tarjDriverTaxi'] == true ||
      this.editarService[0]['bizuPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['bizuPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['bizuTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['bizuEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['bizuDriverTaxi'] == true && this.editarService[0]['transDriverTaxi'] == true) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Tarjeta Editar
    if (this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['tarjDriverTaxi'] == true && this.editarService[0]['efectDriverTaxi'] == true ||
      this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['tarjDriverTaxi'] == true && this.editarService[0]['bizuDriverTaxi'] == true ||
      this.editarService[0]['tarjPiso1'] == true && this.editarService[0]['transPiso1'] == true ||
      this.editarService[0]['tarjPiso2'] == true && this.editarService[0]['transPiso2'] == true ||
      this.editarService[0]['tarjTerap'] == true && this.editarService[0]['transTerap'] == true ||
      this.editarService[0]['tarjEncarg'] == true && this.editarService[0]['transEncarg'] == true ||
      this.editarService[0]['tarjDriverTaxi'] == true && this.editarService[0]['transDriverTaxi'] == true) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }

    // Trans Editar
    if (this.editarService[0]['transPiso1'] == true && this.editarService[0]['efectPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['efectPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['efectTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['efectEncarg'] == true ||
      this.editarService[0]['transDriverTaxi'] == true && this.editarService[0]['efectDriverTaxi'] == true ||
      this.editarService[0]['transPiso1'] == true && this.editarService[0]['bizuPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['bizuPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['bizuTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['bizuEncarg'] == true ||
      this.editarService[0]['transDriverTaxi'] == true && this.editarService[0]['bizuDriverTaxi'] == true ||
      this.editarService[0]['transPiso1'] == true && this.editarService[0]['tarjPiso1'] == true ||
      this.editarService[0]['transPiso2'] == true && this.editarService[0]['tarjPiso2'] == true ||
      this.editarService[0]['transTerap'] == true && this.editarService[0]['tarjTerap'] == true ||
      this.editarService[0]['transEncarg'] == true && this.editarService[0]['tarjEncarg'] == true ||
      this.editarService[0]['transDriverTaxi'] == true && this.editarService[0]['tarjDriverTaxi'] == true) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Se escogio mas de una forma de pago' })
      return false
    }
    return true
  }

  validationsToSelectAPaymentMethod() {

    if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['efectPiso1'] == false &&
      this.editarService[0]['bizuPiso1'] == false && this.editarService[0]['tarjPiso1'] == false &&
      this.editarService[0]['transPiso1'] == false) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 1' })
      return false
    }
    if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['efectPiso2'] == false &&
      this.editarService[0]['bizuPiso2'] == false && this.editarService[0]['tarjPiso2'] == false &&
      this.editarService[0]['transPiso2'] == false) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para piso 2' })
      return false
    }
    if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['efectTerap'] == false &&
      this.editarService[0]['bizuTerap'] == false && this.editarService[0]['tarjTerap'] == false &&
      this.editarService[0]['transTerap'] == false) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para terapeuta' })
      return false
    }
    if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['efectEncarg'] == false &&
      this.editarService[0]['bizuEncarg'] == false && this.editarService[0]['tarjEncarg'] == false &&
      this.editarService[0]['transEncarg'] == false) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para encargada' })
      return false
    }
    if (Number(this.editarService[0]['numberTaxi']) > 0 && this.editarService[0]['efectDriverTaxi'] == false &&
      this.editarService[0]['bizuDriverTaxi'] == false && this.editarService[0]['tarjDriverTaxi'] == false &&
      this.editarService[0]['transDriverTaxi'] == false) {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se escogio ninguna forma de pago para taxista' })
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

  consultToEditTheTherapist(nombre: string) {
    this.serviceTherapist.getByNombre(nombre).subscribe((resp) => {
      this.terapeutaSelect = resp
    })
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

    const paramEditar = this.activatedRoute.snapshot.params['editar']
    this.idUserAdministrador = Number(this.activeRoute.snapshot['_urlSegment']['segments'][1]['path'])
    this.idEditar = Number(this.activeRoute.snapshot.paramMap.get('id'))
    if (paramEditar == "true") {
      this.serviceServices.getByEditar(this.idEditar).subscribe((datosServicio: any) => {
        if (datosServicio.length > 0) {
          this.editamos = true

          this.editarService = datosServicio
          this.SetTheValuesToEmpty()
          this.consultToEditTheTherapist(datosServicio[0].terapeuta)

          // Fechas
          dia = this.editarService[0].fecha.substring(0, 2)
          mes = this.editarService[0].fecha.substring(3, 5)
          this.editarService[0].fecha = `${año}-${mes}-${dia}`

          this.editCollectionsValue()

          this.serviceManager.getByIdAndAdministrador(this.idUserAdministrador).subscribe((datoAdministrador: any[]) => {
            if (datoAdministrador.length > 0) {
              this.buttonDelete = true
            } else {
              this.buttonDelete = false
            }
          })

        } else {
          this.editamos = false
          this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
          this.serviceManager.getById(this.idUser).subscribe((datoUser: any[]) => {
            this.idUser = datoUser[0]
          })
        }
      })
    }
  }

  fullServiceToEdit() {
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

  editService(idServicio, serv: ModelService) {
    this.buttonEdit = document.getElementById('btnEdit') as HTMLButtonElement
    this.buttonEdit.disabled = true;
    if (this.restamosCobroEdit == 0) {
      if (serv.minuto != null) {
        let idUsuario = ''
        idUsuario = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']

        if (!this.expiredDateValidationsEdit()) return
        if (!this.validationsToSelectAPaymentMethod()) return
        if (!this.validationsFormOfPaymentToEdit()) return
        this.fullServiceToEdit()

        if (this.editarService[0]['efectPiso1'] == true || this.editarService[0]['efectPiso2'] == true ||
          this.editarService[0]['efectTerap'] == true || this.editarService[0]['efectEncarg'] == true ||
          this.editarService[0]['efectDriverTaxi'] == true) {
          this.validateEfect = true
          this.efectCheckToggleEdit(this.validateEfect)
        } else {
          localStorage.removeItem('Efectivo')
        }

        if (this.editarService[0]['bizuPiso1'] == true || this.editarService[0]['bizuPiso2'] == true ||
          this.editarService[0]['bizuTerap'] == true || this.editarService[0]['bizuEncarg'] == true ||
          this.editarService[0]['bizuDriverTaxi'] == true) {
          this.validateBizum = true
          this.bizumCheckToggleEdit(this.validateBizum)
        } else {
          localStorage.removeItem('Bizum')
        }

        if (this.editarService[0]['tarjPiso1'] == true || this.editarService[0]['tarjPiso2'] == true ||
          this.editarService[0]['tarjTerap'] == true || this.editarService[0]['tarjEncarg'] == true ||
          this.editarService[0]['tarjDriverTaxi'] == true) {
          this.validateTarjeta = true
          this.tarjCheckToggleEdit(this.validateTarjeta)
        } else {
          localStorage.removeItem('Tarjeta')
        }

        if (this.editarService[0]['transPiso1'] == true || this.editarService[0]['transPiso2'] == true ||
          this.editarService[0]['transTerap'] == true || this.editarService[0]['transEncarg'] == true ||
          this.editarService[0]['transDriverTaxi'] == true) {
          this.validateTrans = true
          this.transCheckToggleEdit(this.validateTrans)
        } else {
          localStorage.removeItem('Trans')
        }

        this.editPaymentMethod()

        this.editManagerAndTherapist()
        this.editValue()

        this.therapist.horaEnd = serv.horaEnd
        this.therapist.fechaEnd = serv.fechaFin
        this.therapist.salida = serv.salida
        this.therapist.minuto = serv.minuto

        this.serviceServices.getById(idServicio).subscribe((rp: any) => {
          if (rp[0]['terapeuta'] != serv.terapeuta) {
            this.serviceTherapist.updateHoraAndSalida(rp[0]['terapeuta'], this.therapist).subscribe((rp: any) => {});
          }
        });

        this.serviceTherapist.update(this.editarService[0]['terapeuta'], this.therapist).subscribe((rp: any) => { })

        this.sortDateToEdit()
        this.serviceServices.updateServicio(idServicio, serv).subscribe((rp: any) => { })

        setTimeout(() => {
          Swal.fire({ position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 2500 })
          this.router.navigate([`menu/${idUsuario}/${serv.pantalla}/${idUsuario}`])
        }, 3000);

      } else {
        this.buttonEdit.disabled = false
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'El campo minutos se encuentra vacio', showConfirmButton: false, timer: 2500 })
      }
    } else {
      this.buttonEdit.disabled = false
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'El total servicio no coincide con el total de cobros', showConfirmButton: false, timer: 2500 })
    }
  }

  editServiceValue() {
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

  editCollectionsValue() {
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

  efectCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroserv = 0, suma = 0
    if (!this.validationsFormOfPaymentToEdit()) return

    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['efectPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Efectivo'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['efectPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Efectivo'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['efectTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['efectEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && this.editarService[0]['efectDriverTaxi'] === true) {
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

  bizumCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPaymentToEdit()) return
    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['bizuPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Bizum'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['bizuPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Bizum'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['bizuTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['bizuEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && this.editarService[0]['bizuDriverTaxi'] === true) {
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

  tarjCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPaymentToEdit()) return
    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['tarjPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Tarjeta'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['tarjPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Tarjeta'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['tarjTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['tarjEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && this.editarService[0]['tarjDriverTaxi'] === true) {
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

  transCheckToggleEdit(event: any) {
    let piso1 = 0, piso2 = 0, terap = 0, encarg = 0, otroservic = 0, suma = 0

    if (!this.validationsFormOfPaymentToEdit()) return
    if (event) {

      if (Number(this.editarService[0]['numberPiso1']) > 0 && this.editarService[0]['transPiso1'] === true) {
        piso1 = Number(this.editarService[0]['numberPiso1'])
        this.editarService[0]['valuePiso1Transaccion'] = Number(this.editarService[0]['numberPiso1'])
      } else {
        piso1 = 0
      }

      if (Number(this.editarService[0]['numberPiso2']) > 0 && this.editarService[0]['transPiso2'] === true) {
        piso2 = Number(this.editarService[0]['numberPiso2'])
        this.editarService[0]['valuePiso2Transaccion'] = Number(this.editarService[0]['numberPiso2'])
      } else {
        piso2 = 0
      }

      if (Number(this.editarService[0]['numberTerap']) > 0 && this.editarService[0]['transTerap'] === true) {
        terap = Number(this.editarService[0]['numberTerap'])
      } else {
        terap = 0
      }

      if (Number(this.editarService[0]['numberEncarg']) > 0 && this.editarService[0]['transEncarg'] === true) {
        encarg = Number(this.editarService[0]['numberEncarg'])
      } else {
        encarg = 0
      }

      if (Number(this.editarService[0]['numberTaxi']) > 0 && this.editarService[0]['transDriverTaxi'] === true) {
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
    if (this.editarService[0]['efectPiso1'] == true) this.editarService[0]['valuePiso1Efectivo'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Efectivo'] = 0

    if (this.editarService[0]['efectPiso2'] == true) this.editarService[0]['valuePiso2Efectivo'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Efectivo'] = 0

    if (this.editarService[0]['bizuPiso1'] == true) this.editarService[0]['valuePiso1Bizum'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Bizum'] = 0

    if (this.editarService[0]['bizuPiso2'] == true) this.editarService[0]['valuePiso2Bizum'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Bizum'] = 0

    if (this.editarService[0]['tarjPiso1'] == true) this.editarService[0]['valuePiso1Tarjeta'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Tarjeta'] = 0

    if (this.editarService[0]['tarjPiso2'] == true) this.editarService[0]['valuePiso2Tarjeta'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Tarjeta'] = 0

    if (this.editarService[0]['transPiso1'] == true) this.editarService[0]['valuePiso1Transaccion'] = Number(this.editarService[0]['numberPiso1'])
    else this.editarService[0]['valuePiso1Transaccion'] = 0

    if (this.editarService[0]['transPiso2'] == true) this.editarService[0]['valuePiso2Transaccion'] = Number(this.editarService[0]['numberPiso2'])
    else this.editarService[0]['valuePiso2Transaccion'] = 0
  }

  editManagerAndTherapist() {

    if (this.editarService[0]['efectTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueEfectTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueEfectTerapeuta'] = 0
    }

    if (this.editarService[0]['bizuTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueBizuTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueBizuTerapeuta'] = 0
    }

    if (this.editarService[0]['tarjTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTarjeTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTarjeTerapeuta'] = 0
    }

    if (this.editarService[0]['transTerap'] == true && Number(this.editarService[0]['numberTerap']) > 0) {
      this.editarService[0]['valueTransTerapeuta'] = Number(this.editarService[0]['numberTerap'])
    } else {
      this.editarService[0]['valueTransTerapeuta'] = 0
    }

    // Encargada

    if (this.editarService[0]['efectEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueEfectEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueEfectEncargada'] = 0
    }

    if (this.editarService[0]['bizuEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueBizuEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueBizuEncargada'] = 0
    }

    if (this.editarService[0]['tarjEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTarjeEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTarjeEncargada'] = 0
    }

    if (this.editarService[0]['transEncarg'] == true && Number(this.editarService[0]['numberEncarg']) > 0) {
      this.editarService[0]['valueTransEncargada'] = Number(this.editarService[0]['numberEncarg'])
    } else {
      this.editarService[0]['valueTransEncargada'] = 0
    }
  }

  deleteService(id) {
    let idUser = ''
    if (this.administratorRole == true) {
      idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
      this.serviceServices.getById(id).subscribe((datoEliminado) => {
        if (datoEliminado) {
          Swal.fire({
            title: '¿Deseas eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Deseo eliminar!'
          }).then((result) => {
            if (result.isConfirmed) {
              this.serviceTherapist.getTerapeuta(datoEliminado[0]['terapeuta']).subscribe((rp: any) => {
                this.serviceTherapist.updateHoraAndSalida(rp[0].nombre, rp[0]).subscribe((rp: any) => { })
              })
              localStorage.removeItem('Efectivo')
              localStorage.removeItem('Bizum')
              localStorage.removeItem('Tarjeta')
              localStorage.removeItem('Trans')
              this.serviceServices.deleteServicio(id).subscribe((rp: any) => {
                this.router.navigate([`menu/${idUser}/vision/${idUser}`])
                Swal.fire({ position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 2500 })
              })
            }
          })
        }
      })
    } else {
      Swal.fire({ position: 'top-end', icon: 'error', title: '¡Oops...!', showConfirmButton: false, timer: 2500,
        text: 'No tienes autorización para borrar, si deseas eliminar el servicio habla con el adminisitrador del sistema'
      })
    }
  }

  cancel() {
    localStorage.removeItem('Efectivo')
    localStorage.removeItem('Bizum')
    localStorage.removeItem('Tarjeta')
    localStorage.removeItem('Trans')
    this.idUser = this.activeRoute.snapshot['_urlSegment']['segments'][1]['path']
    this.router.navigate([`menu/${this.idUser}/vision/${this.idUser}`])
  }
  
}