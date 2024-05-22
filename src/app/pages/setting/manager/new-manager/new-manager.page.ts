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

  validateValuesOfEmpty() {
    if (this.manager.bebida == "") this.manager.bebida = "0"
    if (this.manager.bebidaTerap == "") this.manager.bebidaTerap = "0"
    if (this.manager.fijoDia == "") this.manager.fijoDia = "0"
    if (this.manager.otros == "") this.manager.otros = "0"
    if (this.manager.propina == "") this.manager.propina = "0"
    if (this.manager.servicio == "") this.manager.servicio = "0"
    if (this.manager.tabaco == "") this.manager.tabaco = "0"
    if (this.manager.vitamina == "") this.manager.vitamina = "0"
  }

  resetManager() {
    if (this.manager.nombre != '') this.manager.nombre = ''
    if (this.manager.usuario != '') this.manager.usuario = ''
    if (this.manager.pass != '') this.manager.pass = ''
    if (Number(this.manager.fijoDia) > 0) this.manager.fijoDia = ''
    if (Number(this.manager.servicio) > 0) this.manager.servicio = ''
    if (Number(this.manager.bebida) > 0) this.manager.bebida = ''
    if (Number(this.manager.bebidaTerap) > 0) this.manager.bebidaTerap = ''
    if (Number(this.manager.tabaco) > 0) this.manager.tabaco = ''
    if (Number(this.manager.vitamina) > 0) this.manager.vitamina = ''
    if (Number(this.manager.propina) > 0) this.manager.propina = ''
    if (Number(this.manager.otros) > 0) this.manager.otros = ''
  }

  save() {
    if (this.manager.nombre != "") {
      if (this.manager.usuario != "") {
        if (this.manager.pass != "") {
          this.ionLoaderService.simpleLoader()

          this.manager.nombre = this.manager.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
          this.validateValuesOfEmpty()

          this.serviceManager.getByUsuario(this.manager.usuario).subscribe((rp: any) => {
            if (rp.length == 0) {

              this.serviceManager.registerEncargada(this.manager).subscribe((rp) => {
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
    this.router.navigate([`tabs/${this.iduser}/manager`])
  }

  clean() {
    this.resetManager()
  }


  showKeyBoard(text: string) {
    if (text === 'tabacco' || text === 'vitamin' || text === 'others') {
      var screen = document.querySelector<HTMLElement>(".nueva-encargada")
      var element_to_show = document.querySelector<HTMLElement>(".rectangle-140")
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
    document.getElementById('overview').style.height = '623px'
  }
}