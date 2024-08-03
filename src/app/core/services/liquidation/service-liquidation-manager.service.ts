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

  getLiquidacionesEncargada(company: string) {
    return this.http.get(`${this.API_URL}/getByLiquidacionesEncargada/${company}`);
  }

  getIdEncarg(idEncargada: string) {
    return this.http.get(`${this.API_URL}/getByIdEncarg/${idEncargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  getDateCurrentDay(fechaHoy: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateCurrent/${fechaHoy}/${company}`);
  }

  getEncargadaAndDate(createdDate: string, encargada: string, company: string) {
    return this.http.get(`${this.API_URL}/getFechaHoyByManager`, {
      params: {
        createdDate,
        encargada,
        company
      }
    });
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