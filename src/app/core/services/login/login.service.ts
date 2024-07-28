import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

// Models
import { ModelManager } from '../../models/manager';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  API_URL = 'http://127.0.0.1:8000/api/manager'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  save(manager: ModelManager) {
    return this.http.post(`${this.API_URL}/`, manager).pipe(
      map(result => {
        if (!result)
          return false
        else
          return true
      })
    )
}

getByUserAndPass(email: string, password: string) {
  return this.http.get(`${this.API_URL}/getEmailWithPassword/${email}/${password}`)
}

getByUsuario(email: string) {
  return this.http.get(`${this.API_URL}/email/${email}`)
}
}
