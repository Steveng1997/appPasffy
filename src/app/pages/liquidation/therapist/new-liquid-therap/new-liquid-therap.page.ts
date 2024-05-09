import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Service
import { IonLoaderService } from 'src/app/core/services/loading/ion-loader.service';
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';

@Component({
  selector: 'app-new-liquid-therap',
  templateUrl: './new-liquid-therap.page.html',
  styleUrls: ['./new-liquid-therap.page.scss'],
})

export class NewLiquidTherapPage implements OnInit {

  id: number
  terapeuta: any
  dates: boolean = false

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private ionLoaderService: IonLoaderService,
    private serviceTherapist: TherapistService,
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])

    this.getTherapist()
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((datosTerapeuta: any) => {
      this.terapeuta = datosTerapeuta
    })
  }

  back() {
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
  }

  async inputDateAndTime() {
    this.dates = true
    document.getElementById('overview').style.height = '4065px'
  }
}