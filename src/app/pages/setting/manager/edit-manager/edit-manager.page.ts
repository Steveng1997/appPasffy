import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelManager } from 'src/app/core/models/manager';

// Service
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-edit-manager',
  templateUrl: './edit-manager.page.html',
  styleUrls: ['./edit-manager.page.scss'],
})
export class EditManagerPage implements OnInit {

  visible: boolean = false
  loading: boolean = false
  id: any
  iduser: number
  // Encargada
  managers: any
  pageEncargada!: number
  modalManager: any
  currentDate = new Date().getTime()
  selectedFormPago: string

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
    private serviceManager: ManagerService
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

  update(id: number, encargada) {
    if (this.manager.nombre != "") {
      encargada.nombre = encargada.nombre.replace(/(^\w{1})|(\s+\w{1})/g, letra => letra.toUpperCase())
      this.validateValuesOfEmpty()
      this.serviceManager.updateUser(id, encargada).subscribe((resp => {
        if (resp = true) {
          Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Editado Correctamente!', showConfirmButton: false, timer: 1000 })
          location.replace(`tabs/${this.iduser}/setting`);
        }
      }))
    } else {
      Swal.fire({ heightAuto: false, position: 'top-end', icon: 'error', text: 'El campo del nombre se encuentra vacío', showConfirmButton: false, timer: 1000 })
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
        }).then((result) => {
          if (result.isConfirmed) {
            this.serviceManager.deleteManager(id).subscribe((resp => {
              Swal.fire({ heightAuto: false, position: 'top-end', icon: 'success', title: '¡Eliminado Correctamente!', showConfirmButton: false, timer: 1000 })
              location.replace(`tabs/${this.iduser}/setting`);
            }))
          }
        })
      }
    }
    )
  }

  close() {
    this.router.navigate([`tabs/${this.iduser}/setting`])
  }
}