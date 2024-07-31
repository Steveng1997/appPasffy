import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Model
import { ModelTherapist } from '../../models/therapist';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TherapistService {

  API_Therapist = 'http://127.0.0.1:8000/api/therapist'

  constructor(
    public router: Router,
    private http: HttpClient
  ) { }

  // Register

  save(therapist: ModelTherapist) {
    return this.http.post(`${this.API_Therapist}/`, therapist).pipe(
      map(result => {
        if (!result)
          return false
        else
          return true
      })
    )
  }

  // Get

  getId(id: number) {
    return this.http.get(`${this.API_Therapist}/getId/${id}`);
  }

  name(name: string) {
    return this.http.get(`${this.API_Therapist}/name/${name}`);
  }

  getTherapist() {
    return this.http.get(`${this.API_Therapist}`);
  }

  orderDateEndDesc() {
    return this.http.get(`${this.API_Therapist}/orderDateEndDesc`);
  }

  orderMinutes() {
    return this.http.get(`${this.API_Therapist}/orderMinutes`);
  }

  company(company: string) {
    return this.http.get(`${this.API_Therapist}/company/${company}`);
  }

  getByCompanyOrderByMinutes(company: string) {
    return this.http.get(`${this.API_Therapist}/companyMinutes/${company}`);
  }

  // Update

  update(id: number, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Therapist}/${id}`, therapist);
  }

  update3Item(name, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Therapist}/updateItem/${name}`, therapist);
  }

  updateItems(name: string, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Therapist}/updateItems/${name}`, therapist);
  }

  updateMinutes(id: number, therapist: ModelTherapist) {
    return this.http.put(`${this.API_Therapist}/minutes/${id}`, therapist);
  }

  // Delete

  delete(id: number) {
    return this.http.delete(`${this.API_Therapist}/${id}`);
  }
}