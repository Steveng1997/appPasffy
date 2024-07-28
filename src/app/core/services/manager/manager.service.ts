import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelManager } from '../../models/manager';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {

  API_URL = 'http://127.0.0.1:8000/api/manager'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

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

  // Get

  getManager() {
    return this.http.get(`${this.API_URL}`);
  }

  getId(id: number) {
    return this.http.get(`${this.API_URL}/getId/${id}`);
  }

  idAdmin(id: number) {
    return this.http.get(`${this.API_URL}/idAdmin/${id}`);
  }

  email(email: string) {
    return this.http.get(`${this.API_URL}/email/${email}`);
  }

  name(name: string) {
    return this.http.get(`${this.API_URL}/name/${name}`);
  }

  getEmailWithPassword(email: string, password: string) {
    return this.http.get(`${this.API_URL}/getEmailWithPassword/${email}/${password}`);
  }

  getIdCompany(id: number, company: string) {
    return this.http.get(`${this.API_URL}/getIdCompany/${id}/${company}`)
  }

  company(company: string) {
    return this.http.get(`${this.API_URL}/company/${company}`)
  }

  // Update

  update(id: number, manager: ModelManager) {
    return this.http.put(`${this.API_URL}/${id}`, manager);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}