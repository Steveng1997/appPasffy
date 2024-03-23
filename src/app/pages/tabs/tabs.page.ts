import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  id: string = ""

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.params;
    this.id = params['id']
    document.getElementById('services').style.stroke = '#3C3C3C'
  }

  services() {
    this.router.navigate([`tabs/${this.id}/services`])
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#00AF87'
  }

  vision() {
    this.router.navigate([`tabs/${this.id}/vision`])
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
    document.getElementById('vision').style.stroke = '#00AF87'
  }

  new() {
    this.router.navigate([`tabs/${this.id}/new`])
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
  }

  closing() {
    this.router.navigate([`tabs/${this.id}/closing`])
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#00AF87'
  }

  liquidation() {
    this.router.navigate([`tabs/${this.id}/liquidation-therapist`])
    document.getElementById('vision').style.stroke = '#3C3C3C'
    document.getElementById('services').style.stroke = '#3C3C3C'
    document.getElementById('closing').style.stroke = '#3C3C3C'
    document.getElementById('liquidation').style.stroke = '#00AF87'
  }
}