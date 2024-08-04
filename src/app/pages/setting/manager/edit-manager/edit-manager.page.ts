import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from "dayjs";

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
  managers = []
  currentDate = new Date().getTime()
  company: string

  liquidationManager: LiquidationManager = {
    amount: 0,
    company: "",
    currentDate: 0,
    dateStart: "",
    dateEnd: dayjs().format("YYYY-MM-DD HH:mm"),
    fixeDay: 0,
    id: 0,
    idManag: "",
    manager: "",
    treatment: 0,
    uniqueId: ""
  }

  manager: ModelManager = {
    active: true,
    company: "",
    drink: 0,
    drinkTherapist: 0,
    email: "",
    expiration: false,
    fixeDay: 0,
    name: "",
    others: 0,
    password: "",
    rol: "",
    service: 0,
    tabacco: 0,
    tip: 0,
    vitamin: 0
  }

  modelService: ModelService = {
    idManag: ""
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

    this.serviceManager.getId(this.id).subscribe((rp) => {
      this.company = rp['manager'].company
      this.managers = [rp['manager']]
    })
  }

  async getManagerLiquidationFalse(name) {
    await this.services.getByManagerNotLiquidatedManager(name).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        this.liquidationManager.treatment = rp.length
        this.modelService.liquidatedManager = true

        for (let i = 0; i < rp.length; i++) {
          this.services.updateLiquidatedManager(rp[i]['id'], this.modelService).subscribe((rp) => { })
        }
      }
    })
  }

  async date(name: string) {
    let untilYear = "", untilMonth = "", untilDay = ""

    this.serviceLiquidationManager.getByManager(name).subscribe(async (rp: any) => {
      if (rp.length > 0) {
        untilYear = rp['liquidTherapist'][0].dateEnd.toString().substring(2, 4)
        untilMonth = rp['liquidTherapist'][0].dateEnd.toString().substring(5, 7)
        untilDay = rp['liquidTherapist'][0].dateEnd.toString().substring(8, 10)
        this.liquidationManager.dateStart = `${untilYear}-${untilMonth}-${untilDay}`
        this.liquidationManager.dateStart = rp['liquidTherapist'][0].dateEnd
      } else {
        this.services.getByManagerNotLiquidatedManager(name).subscribe(async (rp: any) => {
          if (rp.length > 0) {
            untilYear = rp['service'][0]['dateToday'].substring(0, 4)
            untilMonth = rp['service'][0]['dateToday'].substring(5, 7)
            untilDay = rp['service'][0]['dateToday'].substring(8, 10)
            this.liquidationManager.dateStart = `${untilYear}-${untilMonth}-${untilDay}`
            this.liquidationManager.dateStart = rp['liquidTherapist'][0].dateEnd
          } else {
            this.liquidationManager.dateStart = dayjs().format("YYYY-MM-DD HH:mm")
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

    this.modelService.idManag = uuid
    this.liquidationManager.uniqueId = uuid
    this.liquidationManager.idManag = uuid
    return this.liquidationManager.uniqueId
  }

  delete(id: number, name: string) {
    this.serviceManager.getId(id).subscribe((resp: any) => {
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
            this.liquidationManager.currentDate = this.currentDate
            this.liquidationManager.manager = name
            this.liquidationManager.company = this.company
            this.createIdUnique()
            await this.date(name)
            await this.getManagerLiquidationFalse(name)

            this.serviceManager.delete(id).subscribe(async (rp: any) => {
              this.serviceLiquidationManager.save(this.liquidationManager).subscribe((rp) => {
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
                this.ionLoaderService.dismissLoader()
                location.replace(`tabs/${this.iduser}/manager`);
              })
            })
          }
        })
      }
    })
  }

  update(id: number, manager) {
    if (manager.name != "") {
      this.ionLoaderService.simpleLoader()
      manager.name = manager.name.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.serviceManager.update(id, manager).subscribe((resp => {
        this.ionLoaderService.dismissLoader()
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
        location.replace(`tabs/${this.iduser}/manager`);
      }))
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
    }
  }

  close() {
    location.replace(`tabs/${this.iduser}/manager`)
  }

  showKeyBoard(text: string) {
    if (text === 'tabacco') {
      document.getElementById('overview').style.overflowY = 'auto'
      document.getElementById('overview').style.overflowX = 'hidden'
      var screen = document.querySelector<HTMLElement>(".editar-encargada")
      var element_to_show = document.getElementById('tabacco')
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

    if (text === 'vitamin') {
      document.getElementById('overview').style.overflowY = 'auto'
      document.getElementById('overview').style.overflowX = 'hidden'
      var screen = document.querySelector<HTMLElement>(".editar-encargada")
      var element_to_show = document.getElementById('vitamin')
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

    if (text === 'others') {
      document.getElementById('overview').style.overflowY = 'auto'
      document.getElementById('overview').style.overflowX = 'hidden'
      var screen = document.querySelector<HTMLElement>(".editar-encargada")
      var element_to_show = document.getElementById('others')
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
  }

  hideKeyBoard() {
    document.getElementById('overview').style.overflow = 'visible'
    document.getElementById('overview').style.height = '623px'
  }
}