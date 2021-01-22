import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Location } from 'src/app/model/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  url: string = `${environment.locationUri}locations`;

  constructor(private http: HttpClient) { }

  getAllLocations() {
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    return this.http.get<Location[]>(this.url, httpOption).toPromise();
  }
}
