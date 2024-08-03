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

  getByCompany(company: string) {
    return this.http.get(`${this.API_URL}/company/${company}`);
  }

  getByIdTherapist(idTherap: string) {
    return this.http.get(`${this.API_URL}/getIdTherap/${idTherap}`);
  }

  getByManagerAndTherapist(therapist: string, manager: string) {
    return this.http.get(`${this.API_URL}/managerAndTherap/${therapist}/${manager}`);
  }

  getByManagerAndCompany(manager: string, company: string) {
    return this.http.get(`${this.API_URL}/managerAndCompany/${manager}/${company}`);
  }

  getByTherapAndCompany(therapist: string, company: string) {
    return this.http.get(`${this.API_URL}/therapAndCompany/${therapist}/${company}`);
  }

  getDateCurrentDay(created_at: string, company: string) {
    return this.http.get(`${this.API_URL}/dateCurrentDay/${created_at}/${company}`);
  }

  getTodayDateAndManager(created_at: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateManager/${created_at}/${manager}}/${company}`);
  }

  // Update

  updateByTherapist(therapist: string, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateByTherapist/${therapist}`, liquidationTherapist);
  }

  updateAmount(idTherap, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateAmount/${idTherap}`, liquidationTherapist);
  }

  updateAmountById(id: number, liquidationTherapist: LiquidationTherapist) {
    return this.http.put(`${this.API_URL}/updateAmountById/${id}`, liquidationTherapist);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}