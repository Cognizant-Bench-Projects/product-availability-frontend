import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoAPI } from 'src/app/model/geoAPI';
import { AvailabilityService } from '../availability-service/availability.service';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  url: string = 'http://api.geonames.org/findNearbyPostalCodesJSON';

  constructor(private http: HttpClient, private availabilityService: AvailabilityService) { }

  searchedByZipCode(zipCode: string, radius: number) {
    if (this.availabilityService.unit === 'Mile') radius = radius * 1.60934;
    return this.http.get<GeoAPI>(`${this.url}?postalcode=${zipCode}&country=US&radius=${radius}&username=jli015&maxRows=500`).toPromise();
  }
  
}
