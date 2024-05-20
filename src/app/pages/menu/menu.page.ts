import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})

export class MenuPage implements OnInit {

  id: string = ""

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const params = this.activatedRoute.snapshot['_routerState']['_root']['children'][0]['value']['params'];
    this.id = params['id']
  }

  setting() {
    this.router.navigate([`tabs/${this.id}/therapist`])
  }

  help() {
    this.router.navigate([`tabs/${this.id}/helps`])
  }

  back() {
    this.router.navigate([`tabs/${this.id}/vision`])
  }

  closing(){
    this.router.navigate([`tabs/${this.id}/closing`])
  }
}