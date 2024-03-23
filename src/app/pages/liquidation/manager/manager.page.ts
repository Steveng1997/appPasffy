import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})

export class ManagerPage {

  constructor(public router: Router) { }

  therapist() {
    this.router.navigate([`tabs/liquidation-therapist`]);
  }

}