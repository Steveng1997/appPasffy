import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationTherapist } from '../../models/liquidationTherapist';

@Injectable({
  providedIn: 'root'
})
export class ServiceLiquidationTherapist {
  
  API_URL = 'https://brave-marvelous-marquis.glitch.me/api/liqTerapeuta'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  settlementRecord(liquidationTherapist: LiquidationTherapist) {
    return this.http.post(`${this.API_URL}/registerLiqTerap`, liquidationTherapist);
  }

  // Get

  consultTherapistSettlements() {
    return this.http.get(`${this.API_URL}/getByLiquidacionesTerapeuta`);
  }

  consultTherapistId(idTerapeuta: string) {
    return this.http.get(`${this.API_URL}/getByIdTerap/${idTerapeuta}`);
  }

  consultTherapistAndManager(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargada`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  consultManager(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  consultTherapist(therapist: string) {
    return this.http.get(`${this.API_URL}/getTherapist/${therapist}`);
  }

  getByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(encargada: string, hastaHoraLiquidado1: string, hastaHoraLiquidado2: string, hastaFechaLiquidado1: string, hastaFechaLiquidado2: string) {
    return this.http.get(`${this.API_URL}/getManagerFechaHoraInicioFechaHoraFinLiquidationTherapist`, {
      params: {
        encargada,
        hastaFechaLiquidado1,
        hastaHoraLiquidado1,
        hastaFechaLiquidado2,
        hastaHoraLiquidado2,
      }
    });
  }

  getWithDistinctByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist(encargada: string, hastaHoraLiquidado1: string, hastaHoraLiquidado2: string, hastaFechaLiquidado1: string, hastaFechaLiquidado2: string) {
    return this.http.get(`${this.API_URL}/getDistinctByManagerFechaHoraInicioFechaHoraFinLiquidationTherapist`, {
      params: {
        encargada,
        hastaFechaLiquidado1,
        hastaHoraLiquidado1,
        hastaFechaLiquidado2,
        hastaHoraLiquidado2,
      }
    });
  }

  // Update

  update(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateTherapistById/${id}`, liquidationTherapist);
  }

  updateById(idTerapeuta, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateIdAndImporte/${idTerapeuta}`, liquidationTherapist);
  }

  updateTerapImporteId(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateByTerapByImporteById/${id}`, liquidationTherapist);
  }

  // Delete

  deleteLiquidationTherapist(id: number) {
    return this.http.delete(`${this.API_URL}/deleteLiquidationTherapists/${id}`);
  }
}