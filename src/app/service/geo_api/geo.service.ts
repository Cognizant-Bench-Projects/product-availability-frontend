import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoAPI } from 'src/app/model/geoAPI';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  url: string = 'http://api.geonames.org/findNearbyPostalCodesJSON';

  constructor(private http: HttpClient) { }

  searchedByZipCode(zipCode: string, radius: number) {
    radius = radius * 1.61;
    return this.http.get<GeoAPI>(`${this.url}?postalcode=${zipCode}&country=US&radius=${radius}&username=jli015`).toPromise();
  }
  
}
