import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit {

  showInfo: boolean = false

  constructor() { }

  ngOnInit() {
    this.showInfo = false
  }

  showDetails() {
    if (this.showInfo == false) this.showInfo = true
    else this.showInfo = false
  }
}
