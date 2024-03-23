import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-therapist',
  templateUrl: './therapist.page.html',
  styleUrls: ['./therapist.page.scss'],
})

export class TherapistPage {

  constructor(public router: Router) { }

  manager() {
    this.router.navigate([`tabs/liquidation-manager`])
  }
}