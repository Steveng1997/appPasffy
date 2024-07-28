import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

// Services
import { ManagerService } from 'src/app/core/services/manager/manager.service';
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';

// Model
import { ModelManager } from 'src/app/core/models/manager';

@Component({
  selector: 'app-new-manager',
  templateUrl: './new-manager.page.html',
  styleUrls: ['./new-manager.page.scss'],
})
export class NewManagerPage implements OnInit {

  visible: boolean = false
  loading: boolean = false
  iduser: number
  // Encargada
  managers: any
  pageEncargada!: number
  modalManager: any
  currentDate = new Date().getTime()

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

  constructor(
    public router: Router,
    private activeRoute: ActivatedRoute,
    private serviceManager: ManagerService,
    private ionLoaderService: IonLoaderService
  ) { }

  ngOnInit(): void {
    const param = this.activeRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.iduser = param['id']
  }

  resetManager() {
    if (this.manager.name != '') this.manager.name = ''
    if (this.manager.email != '') this.manager.email = ''
    if (this.manager.password != '') this.manager.password = ''
    if (this.manager.fixeDay > 0) this.manager.fixeDay = 0
    if (this.manager.service > 0) this.manager.service = 0
    if (this.manager.drink > 0) this.manager.drink = 0
    if (this.manager.drinkTherapist > 0) this.manager.drinkTherapist = 0
    if (this.manager.tabacco > 0) this.manager.tabacco = 0
    if (this.manager.vitamin > 0) this.manager.vitamin = 0
    if (this.manager.tip > 0) this.manager.tip = 0
    if (this.manager.others > 0) this.manager.others = 0
  }

  save() {
    if (this.manager.name != "") {
      if (this.manager.email != "") {
        if (this.manager.password != "") {
          this.ionLoaderService.simpleLoader()

          this.manager.name = this.manager.name.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())

          this.serviceManager.getById(this.iduser).subscribe((rp: any) => {
            this.manager.company = rp[0]['company']

            this.serviceManager.getByUsuario(this.manager.email).subscribe((rp: any) => {
              if (rp.length == 0) {

                this.serviceManager.save(this.manager).subscribe((rp) => {
                  Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Insertado Correctamente!', showConfirmButton: false, timer: 1000 })
                  this.resetManager()
                  this.ionLoaderService.dismissLoader()
                  location.replace(`tabs/${this.iduser}/manager`);
                })
              } else {
                Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'Ya existe este usuario', showConfirmButton: false, timer: 1000 })
                this.ionLoaderService.dismissLoader()
              }
            })
          })
        } else {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo de la contraseña se encuentra vacío' })
        }
      } else {
        Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del usuario se encuentra vacío' })
      }
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío' })
    }
  }

  selectRol(event: any) {
    if (event != "") document.getElementById('imgRol').style.display = 'none'
  }

  close() {
    this.resetManager()
    document.getElementById('imgRol').style.display = 'block'
    location.replace(`tabs/${this.iduser}/manager`)
  }

  clean() {
    this.resetManager()
  }

  showKeyBoard(text: string) {
    if (text === 'tabacco') {
      document.getElementById('overview').style.overflowY = 'auto'
      document.getElementById('overview').style.overflowX = 'hidden'
      var screen = document.querySelector<HTMLElement>(".nueva-encargada")
      var element_to_show = document.getElementById('tabaco')
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

    if (text === 'vitamina') {
      document.getElementById('overview').style.overflowY = 'auto'
      document.getElementById('overview').style.overflowX = 'hidden'
      var screen = document.querySelector<HTMLElement>(".nueva-encargada")
      var element_to_show = document.getElementById('vitamina')
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
      var screen = document.querySelector<HTMLElement>(".nueva-encargada")
      var element_to_show = document.getElementById('otros')
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