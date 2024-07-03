import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Model
import { ModelManager } from 'src/app/core/models/manager';

// Services
import { ManagerService } from 'src/app/core/services/manager/manager.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {

  page!: number

  id: number
  manager: any

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private serviceManager: ManagerService
  ) { }

  ngOnInit() {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = Number(params['id'])

    this.getManager()
  }

  getManager() {
    this.serviceManager.getById(this.id).subscribe(async (rp: any) => {
      this.serviceManager.getByCompany(rp[0].company).subscribe((rp) => {
        this.manager = rp
      })
    })
  }

  therapist() {
    this.router.navigate([`tabs/${this.id}/therapist`])
  }

  editManager(manager: ModelManager) {
    this.router.navigate([`tabs/${this.id}/edit-manager/${manager.id}`])
  }

  newManager() {
    this.router.navigate([`tabs/${this.id}/new-manager`])
  }

  back() {
    this.router.navigate([`tabs/${this.id}/menu`])
  }
}
