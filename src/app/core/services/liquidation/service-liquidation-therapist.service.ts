import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Model
import { LiquidationTherapist } from '../../models/liquidationTherapist';

@Injectable({
  providedIn: 'root'
})
export class ServiceLiquidationTherapist {

  API_URL = 'http://127.0.0.1:8000/api/liquidationTherapist'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  save(liquidationTherapist: LiquidationTherapist) {
    return this.http.post(`${this.API_URL}`, liquidationTherapist);
  }

  // Get

  consultTherapistSettlements(company: string) {
    return this.http.get(`${this.API_URL}/getByLiquidacionesTerapeuta/${company}`);
  }

  consultTherapistId(idTerapeuta: number) {
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

  consultManager(encargada: string, company: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}/${company}`);
  }

  consultTherapist(therapist: string, company: string) {
    return this.http.get(`${this.API_URL}/getTherapist/${therapist}/${company}`);
  }

  getDateCurrentDay(fechaHoy: string, company: string) {
    return this.http.get(`${this.API_URL}/getDateCurrent/${fechaHoy}/${company}`);
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
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}