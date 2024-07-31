import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  id: string = ""
  idUser: number

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params
    this.id = params['id']

    const paramsUser = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.idUser = Number(paramsUser['id'])

    const param = this.activatedRoute.snapshot['_routerState'].url
    const arr = param.split('/')
    const route = arr[arr.length - 1]

    if (route == 'vision') {
      document.getElementById('services').style.stroke = '#3C3C3C'
      document.getElementById('liquidation').style.stroke = '#3C3C3C'
      document.getElementById('menu').style.stroke = '#3C3C3C'
      document.getElementById('vision').style.stroke = '#00AF87'
    }

    if (route == 'services') {
      document.getElementById('services').style.stroke = '#00AF87'
      document.getElementById('liquidation').style.stroke = '#3C3C3C'
      document.getElementById('menu').style.stroke = '#3C3C3C'
      document.getElementById('vision').style.stroke = '#3C3C3C'
    }

    if (route == 'new') {
      document.getElementById('services').style.stroke = '#3C3C3C'
      document.getElementById('liquidation').style.stroke = '#3C3C3C'
      document.getElementById('menu').style.stroke = '#3C3C3C'
      document.getElementById('vision').style.stroke = '#3C3C3C'
    }

    if (route == 'liquidation-therapist') {
      document.getElementById('services').style.stroke = '#3C3C3C'
      document.getElementById('liquidation').style.stroke = '#00AF87'
      document.getElementById('menu').style.stroke = '#3C3C3C'
      document.getElementById('vision').style.stroke = '#3C3C3C'
    }

    if (route == 'menu') {
      document.getElementById('services').style.stroke = '#3C3C3C'
      document.getElementById('liquidation').style.stroke = '#3C3C3C'
      document.getElementById('menu').style.stroke = '#00AF87'
      document.getElementById('vision').style.stroke = '#3C3C3C'
    }

  }

  services() {
    location.replace(`tabs/${this.id}/services`)
  }

  vision() {
    location.replace(`tabs/${this.id}/vision`)
  }

  new() {
    location.replace(`tabs/${this.id}/new`)
  }

  menu() {
    location.replace(`tabs/${this.id}/menu`)
  }

  liquidation() {
    location.replace(`tabs/${this.id}/liquidation-therapist`)
  }
}