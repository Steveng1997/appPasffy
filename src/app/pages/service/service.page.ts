import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})

export class ServicePage implements OnInit {
  details: boolean = true

  constructor() { }

  ngOnInit() {
    // this.details = false
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
