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

  idUser: number
  id: number
  manager: any
  administratorRole: boolean = false

  fechaActual = ''
  horaInicialServicio: string

  restamosCobroEdit = 0
  sumatoriaCobrosEdit = 0
  idEditar: number
  editarService: ModelService[]
  terapeutaSelect: any

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

    this.editForm()
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((datosEncargada: any) => {
      this.manager = datosEncargada
    })
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

  expiredDateValidationsEdit() {
    this.buttonEdit = document.getElementById('btnEdit') as HTMLButtonElement
    this.buttonEdit.disabled = true;

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
      this.buttonEdit.disabled = false;
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

    this.serviceServices.getByEditar(this.id).subscribe((datosServicio: any) => {
      if (datosServicio.length > 0) {
        this.editarService = datosServicio
        this.SetTheValuesToEmpty()
        this.consultToEditTheTherapist(datosServicio[0].terapeuta)

        // Fechas
        dia = this.editarService[0].fecha.substring(0, 2)
        mes = this.editarService[0].fecha.substring(3, 5)
        this.editarService[0].fecha = `${año}-${mes}-${dia}`

        this.editCollectionsValue()

        this.serviceManager.getByIdAndAdministrador(this.idUser).subscribe((datoAdministrador: any[]) => {
          if (datoAdministrador.length > 0) {
            this.buttonDelete = true
          } else {
            this.buttonDelete = false
          }
        })

      } else {
        this.serviceManager.getById(this.idUser).subscribe((datoUser: any[]) => {
          this.idUser = datoUser[0]
        })
      }
    })
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

  save(idServicio, serv: ModelService) {
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
            this.serviceTherapist.updateHoraAndSalida(rp[0]['terapeuta'], this.therapist).subscribe((rp: any) => { });
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
              this.serviceTherapist.getTerapeuta(datoEliminado[0]['terapeuta']).subscribe((rp: any) => {
                this.serviceTherapist.updateHoraAndSalida(rp[0].nombre, rp[0]).subscribe((rp: any) => { })
              })
              localStorage.removeItem('Efectivo')
              localStorage.removeItem('Bizum')
              localStorage.removeItem('Tarjeta')
              localStorage.removeItem('Trans')
              this.serviceServices.deleteServicio(id).subscribe((rp: any) => {
                // this.router.navigate([`menu/${idUser}/vision/${idUser}`])
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.idUser}/setting`);
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