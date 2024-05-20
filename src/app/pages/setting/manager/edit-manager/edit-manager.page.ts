import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelManager } from 'src/app/core/models/manager';
import { LiquidationManager } from 'src/app/core/models/liquidationManager';

// Service
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { ModelService } from 'src/app/core/models/service';
import { ServiceLiquidationManagerService } from 'src/app/core/services/liquidation/service-liquidation-manager.service';
import { ServiceService } from 'src/app/core/services/service/service.service';

@Component({
  selector: 'app-edit-manager',
  templateUrl: './edit-manager.page.html',
  styleUrls: ['./edit-manager.page.scss'],
})
export class EditManagerPage implements OnInit {
  id: any
  iduser: number
  managers: any
  currentDate = new Date().getTime()

  liquidationManager: LiquidationManager = {
    currentDate: "",
    desdeFechaLiquidado: "",
    desdeHoraLiquidado: "",
    encargada: "",
    fixedDay: 0,
    hastaFechaLiquidado: "",
    hastaHoraLiquidado: new Date().toTimeString().substring(0, 5),
    createdDate: "",
    id: 0,
    idUnico: "",
    idEncargada: "",
    importe: 0,
    tratamiento: 0,
  }

  manager: ModelManager = {
    activo: true,
    bebida: "",
    bebidaTerap: "",
    fijoDia: "",
    id: 0,
    nombre: "",
    otros: "",
    pass: "",
    propina: "",
    rol: "",
    servicio: "",
    tabaco: "",
    usuario: "",
    vitamina: ""
  }

  modelService: ModelService = {
    idEncargada: ""
  }

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private serviceManager: ManagerService,
    private services: ServiceService,
    private serviceLiquidationManager: ServiceLiquidationManagerService,
  ) { }

  ngOnInit(): void {
    const params = this.activeRoute.snapshot.params
    this.id = Number(params['id'])

    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']

    this.serviceManager.getById(this.id).subscribe((rp) => {
      return (this.managers = rp)
    })
  }

  validate() {
    if (this.manager.bebida == "") this.manager.bebida = "0"
    if (this.manager.bebidaTerap == "") this.manager.bebidaTerap = "0"
    if (this.manager.fijoDia == "") this.manager.fijoDia = "0"
    if (this.manager.otros == "") this.manager.otros = "0"
    if (this.manager.propina == "") this.manager.propina = "0"
    if (this.manager.servicio == "") this.manager.servicio = "0"
    if (this.manager.tabaco == "") this.manager.tabaco = "0"
    if (this.manager.vitamina == "") this.manager.vitamina = "0"
  }

  async getManagerLiquidationFalse(nombre) {
    await this.services.getManagerLiqFalse(nombre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.liquidationManager.tratamiento = rp.length
        this.modelService.liquidadoEncargada = true

        for (let i = 0; i < rp.length; i++) {
          this.services.updateLiquidacionEncarg(rp[i]['id'], this.modelService).subscribe((rp) => { })
        }
      }
    })
  }

  async date(nombre: string) {
    let fecha = new Date(), añoHasta = 0, mesHasta = 0, diaHasta = 0, convertMes = '', convertDia = '',
      añoDesde = "", mesDesde = "", diaDesde = ""

    diaHasta = fecha.getDate()
    mesHasta = fecha.getMonth() + 1
    añoHasta = fecha.getFullYear()

    if (mesHasta > 0 && mesHasta < 10) {
      convertMes = '0' + mesHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    } else {
      convertMes = mesHasta.toString()
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    if (diaHasta > 0 && diaHasta < 10) {
      convertDia = '0' + diaHasta
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${convertDia}`
    } else {
      this.liquidationManager.hastaFechaLiquidado = `${añoHasta}-${convertMes}-${diaHasta}`
    }

    this.serviceLiquidationManager.getByEncargada(nombre).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        añoDesde = rp[0]['desdeFechaLiquidado'].toString().substring(2, 4)
        mesDesde = rp[0]['desdeFechaLiquidado'].toString().substring(5, 7)
        diaDesde = rp[0]['desdeFechaLiquidado'].toString().substring(8, 10)
        this.liquidationManager.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
        this.liquidationManager.desdeHoraLiquidado = rp[0]['hastaHoraLiquidado']
      } else {
        this.services.getManagerLiqFalse(nombre).subscribe(async (rp: any) => {
          if (rp.length > 0) {
            añoDesde = rp[0]['fechaHoyInicio'].substring(0, 4)
            mesDesde = rp[0]['fechaHoyInicio'].substring(5, 7)
            diaDesde = rp[0]['fechaHoyInicio'].substring(8, 10)
            this.liquidationManager.desdeFechaLiquidado = `${añoDesde}-${mesDesde}-${diaDesde}`
            this.liquidationManager.desdeHoraLiquidado = rp[0]['horaStart']
          }
        })
      }
    })
  }

  createIdUnique() {
    var d = new Date().getTime()
    var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })

    this.modelService.idEncargada = uuid
    this.liquidationManager.idUnico = uuid
    this.liquidationManager.idEncargada = uuid
    return this.liquidationManager.idUnico
  }

  dateCurrentDay() {
    let date = new Date(), day = 0, month = 0, year = 0, convertMonth = '', convertDay = ''

    day = date.getDate()
    month = date.getMonth() + 1
    year = date.getFullYear()

    if (month > 0 && month < 10) {
      convertMonth = '0' + month
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${day}`
    } else {
      convertMonth = month.toString()
      this.liquidationManager.createdDate = `${year}-${month}-${day}`
    }

    if (day > 0 && day < 10) {
      convertDay = '0' + day
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${convertDay}`
    } else {
      this.liquidationManager.createdDate = `${year}-${convertMonth}-${day}`
    }
  }

  delete(id: number, nombre: string) {
    this.serviceManager.getById(id).subscribe((resp: any) => {
      if (resp) {
        Swal.fire({
          heightAuto: false,
          title: '¿Deseas eliminar el registro?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Deseo eliminar!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.ionLoaderService.simpleLoader()
            this.liquidationManager.currentDate = this.currentDate.toString()
            this.liquidationManager.encargada = nombre
            this.dateCurrentDay()
            this.createIdUnique()
            await this.date(nombre)
            await this.getManagerLiquidationFalse(nombre)

            this.serviceManager.deleteManager(id).subscribe(async (rp: any) => {
              this.serviceLiquidationManager.settlementRecord(this.liquidationManager).subscribe((rp) => {
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.iduser}/setting`);
              })
            })
          }
        })
      }
    })
  }

  update(id: number, encargada) {
    if (encargada.nombre != "") {
      this.ionLoaderService.simpleLoader()
      encargada.nombre = encargada.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.validate()
      this.serviceManager.updateUser(id, encargada).subscribe((resp => {
        this.ionLoaderService.dismissLoader()
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
        location.replace(`tabs/${this.iduser}/setting`);
      }))
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  close() {
    this.router.navigate([`tabs/${this.iduser}/setting`])
  }
}