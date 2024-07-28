import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelTherapist } from 'src/app/core/models/therapist';

// Services
import { TherapistService } from 'src/app/core/services/therapist/therapist.service';
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.page.html',
  styleUrls: ['./therapist.page.scss'],
})
export class TherapistPage implements OnInit {

  page!: number
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
  }

  getTherapist() {
    this.serviceManager.getId(this.id).subscribe(async (rp: any) => {
      this.serviceTherapist.company(rp[0].company).subscribe((rp) => {
        this.therapist = rp
      })
    })
  }

  filterManager() {
    this.router.navigate([`tabs/${this.id}/manager`])
  }

  back() {
    this.router.navigate([`tabs/${this.id}/menu`])
  }

  newTherapist() {
    this.router.navigate([`tabs/${this.id}/new-therapist`])
  }

  editTherapist(therapist: ModelTherapist) {
    this.router.navigate([`tabs/${this.id}/edit-therapist`, therapist.id])
  }
}