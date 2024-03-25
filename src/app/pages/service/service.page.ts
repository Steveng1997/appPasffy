import { Component, OnInit } from '@angular/core';

// Services
import { ServiceService } from 'src/app/core/services/service/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit {
  details: boolean = true
  servicio: any

  constructor(
    private serviceService: ServiceService
  ) { }

  ngOnInit() {
    // this.details = false
  }

  getServices = async () => {
    let service
    // this.serviceManager.getById(this.idUser).subscribe((rp) => {
    //   if (rp[0]['rol'] == 'administrador') {
        this.serviceService.getServicio().subscribe((rp: any) => {
          this.servicio = rp
          service = rp

          // if (rp.length != 0) {
          //   this.totalSumOfServices(service)
          // }
          return service
        })
      // } else {
      //   this.service.getByManagerOrder(rp[0]['nombre']).subscribe((rp: any) => {
      //     this.servicio = rp
      //     service = rp
      //     if (rp.length != 0) {
      //       this.totalSumOfServices(service)
      //     }
      //     return service
      //   })
      // }
    // })
  }

  aqui() {
    if (this.details == false) {
      this.details = true
      document.getElementById('segundo').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo2').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo3').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo4').style.top = 'calc(70% - 163px)'
      document.getElementById('segundo5').style.top = 'calc(70% - 163px)'
    } else {
      document.getElementById('segundo').style.top = '41px'
      document.getElementById('segundo2').style.top = '102px'
      document.getElementById('segundo3').style.top = '102px'
      document.getElementById('segundo4').style.top = '102px'
      document.getElementById('segundo5').style.top = '102px'
      this.details = false
    }
  }
}
