import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelManager } from '../../models/manager';

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
    return this.http.post(`${this.API_URL}`, manager);
  }

  // Get

  getUsuarios() {
    return this.http.get(`${this.API_URL}`);
  }

  getById(id: number) {
    return this.http.get(`${this.API_URL}/getId/${id}`);
  }

  getByIdAndAdministrador(id: number) {
    return this.http.get(`${this.API_URL}/idAdmin/${id}`);
  }

  getByUsuario(usuario: string) {
    return this.http.get(`${this.API_URL}/email/${usuario}`);
  }

  getEncargada(nombre: string) {
    return this.http.get(`${this.API_URL}/name/${nombre}`);
  }

  getByUserAndPass(email: string, password: string) {
    return this.http.get(`${this.API_URL}/getEmailWithPassword/${email}/${password}`);
  }

  getIdAndCompany(id: number, company: string) {
    return this.http.get(`${this.API_URL}/getIdCompany/${id}/${company}`)
  }

  getByCompany(company: string) {
    return this.http.get(`${this.API_URL}/company/${company}`)
  }

  // Update

  updateUser(id: number, manager: ModelManager) {
    return this.http.put(`${this.API_URL}/updateEncargada/${id}`, manager);
  }

  // Delete

  deleteManager(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}