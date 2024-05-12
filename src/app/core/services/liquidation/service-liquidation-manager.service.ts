import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationManager } from '../../models/liquidationManager';

@Injectable({
  providedIn: 'root'
})

export class ServiceLiquidationManagerService {

  API_URL = 'https://brave-marvelous-marquis.glitch.me/api/liqEncargada'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liquidationManger: LiquidationManager) {
    return this.http.post(`${this.API_URL}/registerLiqEncarg`, liquidationManger);
  }

  // Get

  getLiquidacionesEncargada() {
    return this.http.get(`${this.API_URL}/getByLiquidacionesEncargada`);
  }

  getIdEncarg(idEncargada: string) {
    return this.http.get(`${this.API_URL}/getByIdEncarg/${idEncargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  getDateCurrentDay(fechaHoy: string) {
    return this.http.get(`${this.API_URL}/getDateCurrent/${fechaHoy}`);
  }

  getEncargadaAndDate(createdDate: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getFechaHoyByManager`, {
      params: {
        createdDate,
        encargada
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

  deleteLiquidationManager(id: number) {
    return this.http.delete(`${this.API_URL}/deleteLiquidationManagers/${id}`);
  }
}