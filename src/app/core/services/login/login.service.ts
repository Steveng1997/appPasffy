import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelManager } from '../../models/manager';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  // API_URL = 'http://35.181.62.147:3000/api/encargada';
  API_URL = 'https://brave-marvelous-marquis.glitch.me/api/encargada'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Create

  registerEncargada(manager: ModelManager) {
    return this.http.post(`${this.API_URL}/registerEncargada`, manager);
  }

  // get

  getByUserAndPass(usuario: string, pass: string) {
    return this.http.get(`${this.API_URL}/usuarioAndpass`, {
      params: {
        usuario,
        pass
      }
    });
  }

  getByUsuario(usuario: string) {
    return this.http.get(`${this.API_URL}/usuarioEncargada/${usuario}`);
  }
}
