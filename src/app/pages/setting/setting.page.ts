import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';
import { ModelManager } from 'src/app/core/models/manager';

// Services
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})

export class SettingPage implements OnInit {

  id: number
  therapist: any
  manager: any

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceTherapist: TherapistService,
    private serviceManager: ManagerService
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])

    this.getTherapist()
    this.getManager()
  }

  getTherapist() {
    this.serviceTherapist.getAllTerapeuta().subscribe((rp) => {
      this.therapist = rp
    })
  }

  getManager() {
    this.serviceManager.getUsuarios().subscribe((rp) => {
      this.manager = rp
    })
  }

  back() {
    this.router.navigate([`tabs/${this.id}/menu`])
  }

  newManager() {
    this.router.navigate([`tabs/${this.id}/new-manager`])
  }

  newTherapist() {
    this.router.navigate([`tabs/${this.id}/new-therapist`])
  }

  editTherapist(therapist: ModelTherapist) {
    this.router.navigate([`tabs/${this.id}/edit-therapist`, therapist.id])
  }

  editManager(manager: ModelManager) {
    this.router.navigate([`tabs/${this.id}/edit-manager/${manager.id}`])
  }
}