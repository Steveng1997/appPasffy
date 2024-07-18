import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class IonLoaderService {
  constructor(public loadingController: LoadingController) { }

  simpleLoader() {
    this.loadingController.create({
      message: 'Loading...',
      cssClass: 'custom-loader-class',
    }).then((response) => {
      response.present()
    })
  }

  dismissLoader() {
    this.loadingController.dismiss().then((response) => {
      console.log('Loader closed!', response)
    }).catch((err) => {
      console.log('Error occured : ', err)
    })
  }

  autoLoader() {
    this.loadingController.create({
      message: 'Loading....',
      duration: 1000
    }).then((response) => {
      response.present()
      response.onDidDismiss().then((response) => {
        console.log('Loader dismissed', response)
      })
    })
  }

  customLoader() {
    this.loadingController.create({
      message: 'Loader with custom style',
      duration: 4000,
      cssClass: 'loader-css-class',
      backdropDismiss: true
    }).then((res) => {
      res.present()
    })
  }
}