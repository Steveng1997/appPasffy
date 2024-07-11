import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelManager } from '../../models/manager';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {

  API_URL = 'https://brave-marvelous-marquis.glitch.me/api/encargada'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  registerEncargada(manager: ModelManager) {
    return this.http.post(`${this.API_URL}/registerEncargada`, manager);
  }

  // Get

  getById(id: number) {
    return this.http.get(`${this.API_URL}/idEncargada/${id}`);
  }

  getByIdAndAdministrador(id: number) {
    return this.http.get(`${this.API_URL}/idAdmin/${id}`);
  }

  getByUsuario(usuario: string) {
    return this.http.get(`${this.API_URL}/usuarioEncargada/${usuario}`);
  }

  getEncargada(nombre: string) {
    return this.http.get(`${this.API_URL}/nombreEncargada/${nombre}`);
  }

  getByUserAndPass(usuario: string, pass: string) {
    return this.http.get(`${this.API_URL}/usuarioAndpass`, {
      params: {
        usuario,
        pass
      }
    });
  }

  getUsuarios() {
    return this.http.get(`${this.API_URL}/listaEncargada`);
  }

  getIdAndCompany(id: number, company: string) {
    return this.http.get(`${this.API_URL}/getIdCompany/${id}/${company}`)
  }

  getByCompany(company: string) {
    return this.http.get(`${this.API_URL}/getCompany/${company}`)
  }  

  // Update

  updateUser(id: number, manager: ModelManager) {
    return this.http.put(`${this.API_URL}/updateEncargada/${id}`, manager);
  }

  // Delete

  deleteManager(id: number) {
    return this.http.delete(`${this.API_URL}/deleteEncargada/${id}`);
  }
}