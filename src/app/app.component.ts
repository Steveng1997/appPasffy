import { Component, HostListener, Injector, OnInit, effect, signal, untracked } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public actividad = signal(true)
  private time: any

  @HostListener('mousemove', ['$event'])
  public enviarMouse(btn: any) {
    console.log("se ejecuta el Mouse")
    this.actividad.set(true)
  }

  constructor(
    private inject: Injector
  ) { }

  ngOnInit(): void {
    this.metodoInactividad()
  }

  metodoInactividad() {
    effect(() => {

      if (this.actividad()) {
        console.log("La actividad cambia", this.actividad())

        if (this.time) {
          clearTimeout(this.time)
        }

        this.time = setTimeout(() => {
          // alert("Se va cerrar por inactividad")
          // window.close()
          location.reload()
        }, 20000);

        untracked(() => {
          this.actividad.set(false)
        })
      }
    }, { injector: this.inject })
  }

}
