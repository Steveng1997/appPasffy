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

  geyByCurrentDesc() {
    return this.http.get(`${this.API_URL}/getByCierreTrue`);
  }

  getByTerapeutaAndEncargada(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargada/${terapeuta}/${encargada}`);
  }

  getByEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargada/${encargada}`);
  }

  getByManagerOrder(encargada: string) {
    return this.http.get(`${this.API_URL}/getManagerOrderCurrentDate/${encargada}`);
  }

  getByCierre(idCierre: string) {
    return this.http.get(`${this.API_URL}/getIdCierre/${idCierre}`);
  }

  getService() {
    return this.http.get(`${this.API_URL}`);
  }

  getByLiquidTerapFalse() {
    return this.http.get(`${this.API_URL}/getByLiquidacionTerapeutaFalse`);
  }

  getByLiquidManagerFalse() {
    return this.http.get(`${this.API_URL}/getByLiquidacionManagerFalse`);
  }

  getByIdTerap(idTerap: string) {
    return this.http.get(`${this.API_URL}/getIdTerapeuta/${idTerap}`);
  }

  getByIdCierreDistinct(idCierre: string) {
    return this.http.get(`${this.API_URL}/getIdCierreDistinct/${idCierre}`);
  }

  getByIdEncarg(idEncargada: string) {
    return this.http.get(`${this.API_URL}/getIdEncargada/${idEncargada}`);
  }

  geyByCierreFalse() {
    return this.http.get(`${this.API_URL}/getCierreFalse`);
  }

  getById(id: number) {
    return this.http.get(`${this.API_URL}/getId/${id}`);
  }

  getByEditar(id: number) {
    return this.http.get(`${this.API_URL}/getIdEditar/${id}`);
  }

  getTerapeutaByAsc(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaAsc/${terapeuta}`);
  }

  getByTherapistIdDesc(therapist: string) {
    return this.http.get(`${this.API_URL}/therapistIdDesc/${therapist}`);
  }

  getTerapeuta(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeuta/${terapeuta}`);
  }

  getEncargada(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargada/${encargada}`);
  }

  getByTodayDateAndManagerAndCompanyCurrentDateDesc(dateToday: string, manager: string, company: string) {
    return this.http.get(`${this.API_URL}/todayDateAndManagerAndCompanyCurrentDateDesc/${dateToday}/${manager}/${company}`);
  }

  getTerapeutaEncargada(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeuAndEncar`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getEncargadaAndLiquidacion(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaLiquidacionFalse/${encargada}`);
  }

  getEncargadaNoLiquidadaTerap(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaLiquidadoTerpFalse/${encargada}`);
  }

  getEncargadaNoLiquidada(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargNoLiquid/${encargada}`);
  }

  getEncargadaNoLiquidadaByFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargNoLiquidByFechaDesc/${encargada}`);
  }

  getTerapNoLiquidadaByFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapgNoLiquidByFechaDesc/${encargada}`);
  }

  getEncargadaNoLiquidadaByFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getNoEncargNoLiquidByFechaAsc/${encargada}`);
  }

  getTerapNoLiquidadaByFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getNoTerapNoLiquidByFechaAsc/${encargada}`);
  }

  getEncargadaNoCierre(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaNoCierre/${encargada}`);
  }

  getTerapeutaFechaAsc(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getByTerapFechaAsc`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getTerapeutaFechaAscByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getByTerapFechaAscByLiquidadoTrue`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getEncargadaFechaAscByLiqTrue(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqTrue/${encargada}`);
  }

  getEncargFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargFechaAscByLiqFalse/${encargada}`);
  }

  getTerapeutaFechaDesc(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDesc`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getTerapeutaFechaDescByLiqTrue(terapeuta: string, encargada: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaAndEncargadaFechaDescLiqTrue`, {
      params: {
        terapeuta,
        encargada
      }
    });
  }

  getEncargadaFechaDescByLiqTrue(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaByLiqTrue/${encargada}`);
  }

  getTerapeutaWithCurrentDate(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaWithCurrentDate/${terapeuta}`);
  }

  getEncargFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargFechaDesc/${encargada}`);
  }

  getEncargadaFechaAsc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaFechaAsc/${encargada}`);
  }

  getEncargadaFechaDesc(encargada: string) {
    return this.http.get(`${this.API_URL}/getByEncargadaFechaDesc/${encargada}`);
  }

  getByDateDayAndCompantCurrentDateDesc(dateToday: string, company: string) {
    return this.http.get(`${this.API_URL}/dateDayAndCompantCurrentDateDesc/${dateToday}/${company}`);
  }

  getIdDescendente(idUnico: string) {
    return this.http.get(`${this.API_URL}/getByIdDesc/${idUnico}`);
  }

  getbYTerapeutaEncargadaFechaHoraInicio(terapeuta: string, encargada: string, fecha: string, horaStart: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaEncargadaFechaHoraInicio/${terapeuta}/${encargada}/${fecha}/${horaStart}`);
  }

  getByTerapeutaEncargadaFechaHoraInicioFechaHoraFin(terapeuta: string, encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string, company: string) {
    return this.http.get(`${this.API_URL}/getTerapeutaEncargadaFechaHoraInicioFechaHoraFin`, {
      params: {
        terapeuta,
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
        company
      }
    });
  }

  getByEncargadaFechaHoraInicioFechaHoraFin(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string, company: string) {
    return this.http.get(`${this.API_URL}/getEncargadaFechaHoraInicioFechaHoraFin`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
        company
      }
    });
  }

  getManagerWithDate(encargada: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getManagerWithDate`, {
      params: {
        encargada,
        fecha
      }
    });
  }

  getTherapistWithDate(terapeuta: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getTherapistWithDate`, {
      params: {
        terapeuta,
        fecha
      }
    });
  }

  getManagerpaymentForm(encargada: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getManagerpaymentForm`, {
      params: {
        encargada,
        fecha
      }
    });
  }

  getTherapistpaymentForm(terapeuta: string, fecha: string) {
    return this.http.get(`${this.API_URL}/getTherapistpaymentForm`, {
      params: {
        terapeuta,
        fecha
      }
    });
  }


  getManagerAndDate(encargada: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getManagerAndDate`, {
      params: {
        encargada,
        fecha,
        fechaFin
      }
    });
  }

  getpaymentFormAndDate(formaPago: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getpaymentFormAndDate`, {
      params: {
        formaPago,
        fecha,
        fechaFin
      }
    });
  }

  getFechaAndId(id: number, fechaHoyInicio: string) {
    return this.http.get(`${this.API_URL}/getFechaWithId`, {
      params: {
        id,
        fechaHoyInicio
      }
    });
  }

  getTerapeutaLiqFalse(terapeuta: string) {
    return this.http.get(`${this.API_URL}/getByTerapeutaLiquidatedZero/${terapeuta}`);
  }

  getManagerLiqFalse(encargada: string) {
    return this.http.get(`${this.API_URL}/getByManagerLiquidatedZero/${encargada}`);
  }

  getPaymentForm(formaPago: string) {
    return this.http.get(`${this.API_URL}/getPaymenForm/${formaPago}`);
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

  // closing

  getManagerClosing(encargada: string) {
    return this.http.get(`${this.API_URL}/getEncargadaClosing/${encargada}`);
  }

  getByClosingFalse() {
    return this.http.get(`${this.API_URL}/getClosingByFalse`);
  }

  getWithDistinctByManagerFechaHoraInicioFechaHoraFinClosing(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getDistinctManagerFechaHoraInicioFechaHoraFinClosing`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
      }
    });
  }

  getByManagerFechaHoraInicioFechaHoraFinClosing(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getManagerFechaHoraInicioFechaHoraFinClosing`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
      }
    });
  }

  getServicesByNumberTerap(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getServicesNumberTerap`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
      }
    });
  }

  getWithDistinctServicesByNumberTerap(encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getDistinctServicesByNumberTerap`, {
      params: {
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd,
      }
    });
  }

  getByTherapistFechaHoraInicioFechaHoraFinClosing(terapeuta: string, encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getTherapistAndManagerFechaHoraInicioFechaHoraFinClosing`, {
      params: {
        terapeuta,
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd
      }
    });
  }

  getByTherapistFechaHoraInicioFechaHoraFinClosingTrue(terapeuta: string, encargada: string, horaStart: string, horaEnd: string, fecha: string, fechaFin: string) {
    return this.http.get(`${this.API_URL}/getTherapistAndManagerFechaHoraInicioFechaHoraFinClosingTrue`, {
      params: {
        terapeuta,
        encargada,
        fecha,
        horaStart,
        fechaFin,
        horaEnd
      }
    });
  }

  // Update

  updateServicio(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByServicio/${id}`, service);
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

  updateLiquidacionTerap(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionTerap/${id}`, service);
  }

  updateLiquidacionEncarg(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByLiquidacionEncarg/${id}`, service);;
  }

  updateCierre(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByCierre/${id}`, service);;
  }

  updatePisos(id: number, idUnico: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateByValuePisos/${id}/${idUnico}`, service);
  }

  updateTherapistSettlementTherapistIdByTherapistId(idTerapeuta: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updatesTherapistSettlementTherapistIdByTherapistId/${idTerapeuta}`, service);
  }

  updateManagerSettlementManagerIdByManagerId(idEncargada: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updatesManagerSettlementManagerIdByManagerId/${idEncargada}`, service);
  }

  updateClosingByIdClosing(idCierre: string, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateClosingIdClosing/${idCierre}`, service);
  }

  updateScreenById(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateScreenById/${id}`, service);
  }

  updateNote(id: number, service: ModelService) {
    return this.http.put(`${this.API_URL}/updateScreenById/${id}`, service);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
