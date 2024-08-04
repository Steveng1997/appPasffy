import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationManager } from '../../models/liquidationManager';

@Injectable({
  providedIn: 'root'
})

export class ServiceLiquidationManagerService {

  API_URL = 'http://127.0.0.1:8000/api/liquidationManager'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  save(liquidationManger: LiquidationManager) {
    return this.http.post(`${this.API_URL}`, liquidationManger);
  }

  // Get

  getByCompany(company: string) {
    return this.http.get(`${this.API_URL}/company/${company}`);
  }

  getByIdManager(idManag: string) {
    return this.http.get(`${this.API_URL}/getIdManag/${idManag}`);
  }

  getByManager(manager: string) {
    return this.http.get(`${this.API_URL}/manager/${manager}`);
  }

  getDateCurrentDay(created_at: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateCurrentDay/${created_at}/${company}`);
  }

  getDateTodayByManager(created_at: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateTodayByManager/${created_at}/${manager}/${company}`);
  }

  // Update

  updateById(idEncargada: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idEncargada}`, liquidationManger);
  }

  updateEncargImporteId(id: number, liquidationManger: LiquidationManager) {
    return this.http.put(`${this.API_URL}/updateByEncargByImporteById/${id}`, liquidationManger);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}