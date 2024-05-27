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
      document.getElementById('closing').style.stroke = '#3C3C3C'
      document.getElementById('vision').style.stroke = '#00AF87'
    }
  }

  services() {
    location.replace(`tabs/${this.id}/services`)
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#00AF87'
  }

  vision() {
    location.replace(`tabs/${this.id}/vision`)
  }

  new() {
    location.replace(`tabs/${this.id}/new`)
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
  }

  closing() {
    location.replace(`tabs/${this.id}/menu`)
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#00AF87'
  }

  liquidation() {
    location.replace(`tabs/${this.id}/liquidation-therapist`)
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#00AF87'
  }
}