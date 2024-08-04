import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Models
import { ModelService } from '../../models/service';

@Injectable({
  providedIn: 'root'
})

export class ServiceService {

  API_URL = 'http://127.0.0.1:8000/api/service'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  save(service: ModelService) {
    return this.http.post(`${this.API_URL}/`, service);
  }

  // Get

  getByTherapistAndManagerNotLiquidatedTherapist(therapist: string, manager: string) {
    return this.http.get(`${this.API_URL}/therapistAndManagerNotLiquidatedTherapist/${therapist}/${manager}`);
  }

  getService() {
    return this.http.get(`${this.API_URL}`);
  }

  getByLiquidateTherapistFalse() {
    return this.http.get(`${this.API_URL}/liquidateTherapistFalse`);
  }

  getByLiquidateManagerFalse() {
    return this.http.get(`${this.API_URL}/liquidateManagerFalse`);
  }

  getByIdTherapist(idTherap: string) {
    return this.http.get(`${this.API_URL}/idTherapist/${idTherap}`);
  }

  getByIdManager(idManag: string) {
    return this.http.get(`${this.API_URL}/idManager/${idManag}`);
  }

  getById(id: number) {
    return this.http.get(`${this.API_URL}/getId/${id}`);
  }

  getByIdEditTrue(id: number) {
    return this.http.get(`${this.API_URL}/idEditTrue/${id}`);
  }

  getByTherapistIdDesc(therapist: string) {
    return this.http.get(`${this.API_URL}/therapistIdDesc/${therapist}`);
  }

  getByTodayDateAndManagerAndCompanyCurrentDateDesc(dateToday: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndManagerAndCompanyCurrentDateDesc/${dateToday}/${manager}/${company}`);
  }

  getByTherapistAndManagerAndNotLiquidatedTherapistCurrentDateAsc(therapist: string, manager: string) {
    return this.http.get(`${this.API_URL}/therapistAndManagerAndNotLiquidatedTherapistCurrentDateAsc/${therapist}/${manager}`);
  }

  getByTherapistAndManagerAndLiquidatedTherapistCurrentDateAsc(therapist: string, manager: string) {
    return this.http.get(`${this.API_URL}/therapistAndManagerAndLiquidatedTherapistCurrentDateAsc/${therapist}/${manager}`);
  }

  getByManagerAndLiquidatedManagerCurrentDateDesc(manager: string) {
    return this.http.get(`${this.API_URL}/managerAndLiquidatedManagerCurrentDateDesc/${manager}`);
  }

  getByTherapistCurrentDateDesc(therapist: string) {
    return this.http.get(`${this.API_URL}/therapistCurrentDateDesc/${therapist}`);
  }

  getByManagerAndNotLiquidatedManagerCurrentDateAsc(manager: string) {
    return this.http.get(`${this.API_URL}/managerAndNotLiquidatedManagerCurrentDateAsc/${manager}`);
  }

  getByManagerAndNotLiquidatedManager(manager: string) {
    return this.http.get(`${this.API_URL}/managerAndNotLiquidatedManager/${manager}`);
  }

  getByDateDayAndCompantCurrentDateDesc(dateToday: string, company: string) {
    return this.http.get(`${this.API_URL}/dateDayAndCompantCurrentDateDesc/${dateToday}/${company}`);
  }

  getByUniqueIdDesc(uniqueId: string) {
    return this.http.get(`${this.API_URL}/uniqueIdDesc/${uniqueId}`);
  }

  getbYTerapeutaEncargadaFechaHoraInicio(terapeuta: string, encargada: string, fecha: string, horaStart: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaEncargadaFechaHoraInicio/${terapeuta}/${encargada}/${fecha}/${horaStart}`);
  }

  getByTherapistAndManagerAndCompany(therapist: string, manager: string, dateStart: string, dateEnd: string, company: string) {
    return this.http.get(`${this.API_URL}/therapistAndManagerAndCompany/${therapist}/${manager}/${dateStart}/${dateEnd}/${company}`);
  }

  getByManagerAndDateStartAndDateEndAndCompany(manager: string, dateStart: string, dateEnd: string, company: string) {
    return this.http.get(`${this.API_URL}/managerAndDateStartAndDateEndAndCompany/${manager}/${dateStart}/${dateEnd}/${company}`);
  }

  getByTherapistNotLiquidatedTherapist(therapist: string) {
    return this.http.get(`${this.API_URL}/therapistNotLiquidatedTherapist/${therapist}`);
  }

  getByManagerNotLiquidatedManager(manager: string) {
    return this.http.get(`${this.API_URL}/managerNotLiquidatedManager/${manager}`);
  }

  getLikePayment(payment: string) {
    return this.http.get(`${this.API_URL}/getLikePayment/${payment}`);
  }

  getByTodayDateAndTherapistAndCompany(dateToday: string, therapist: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndTherapistAndCompany/${dateToday}/${therapist}/${company}`);
  }

  getByTodayDateAndManagerAndCompany(dateToday: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndManagerAndCompany/${dateToday}/${manager}/${company}`);
  }

  getByTodayDateAndManagerAndCompanyDistinctTherapist(dateToday: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndManagerAndCompanyDistinctTherapist/${dateToday}/${manager}/${company}`);
  }

  getByTodayDateAndTherapistAndManagerAndCompany(dateToday: string, therapist: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndTherapistAndManagerAndCompany/${dateToday}/${therapist}/${manager}/${company}`);
  }

  getCompany(company: string) {
    return this.http.get(`${this.API_URL}/company/${company}`);
  }
  // Update

  update(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/${id}`, service);
  }

  updateAllServicio(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateAllTheServicio/${id}`, service);
  }

  updateNumberPiso1(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso1/${idUnico}`, service);
  }

  updateWithValueNumberPiso1(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso1/${id}/${idUnico}`, service);
  }

  updateNumberPiso2(idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByNumberPiso2/${idUnico}`, service);
  }

  updateWithValueNumberPiso2(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByWithValueNumberPiso2/${id}/${idUnico}`, service);
  }

  updateLiquidatedTherapist(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/liquidatedTherapist/${id}`, service);
  }

  updateLiquidatedManager(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/liquidatedManager/${id}`, service);;
  }

  updateCierre(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByCierre/${id}`, service);;
  }

  updatePisos(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByValuePisos/${id}/${idUnico}`, service);
  }

  updateLiquidatedTherapistByIdTherap(idTherap: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/liquidatedTherapistByIdTherap/${idTherap}`, service);
  }

  updateLiquidatedManagerByIdManager(idManag: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/liquidatedManagerByIdManager/${idManag}`, service);
  }

  updateScreen(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/screen/${id}`, service);
  }

  updateNotes(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/note/${id}`, service);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
