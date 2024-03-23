import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.page.html',
  styleUrls: ['./helps.page.scss'],
})

export class HelpsPage {

  constructor(public router: Router) { }

  back() {
    this.router.navigate([`menu`])
  }
}