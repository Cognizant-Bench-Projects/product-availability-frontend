import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Balance } from 'src/app/model/balance';
import { GeoInfo } from 'src/app/model/geoInfo';
import { environment } from '../../../environments/environment';
import { AvailabilityService } from '../availability-service/availability.service';
import { GeoService } from '../geo_api/geo.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  @Output() invalidZipCode: EventEmitter<any> = new EventEmitter<any>();
  url: string = `${environment.balanceUri}available-items`;
  zipCodeResult: GeoInfo[] = [];

  constructor(private http: HttpClient, private availabilityService: AvailabilityService, private geoService: GeoService) { }

  getAllAvailableItems(deptId: number, prodId: number, locId: number, searchByZipCode: boolean = false) {
    this.availabilityService.loading = true;

    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    this.http.get<Balance[]>(`${this.url}?location=${locId}&product=${prodId}&department=${deptId}`, httpOption).toPromise().then(
      data => {
        if (!searchByZipCode) {
          this.availabilityService.showDistance = false;
          this.availabilityService.availableItems = data;
        } else {
          this.availabilityService.showDistance = true;
          this.availabilityService.availableItems = [];

          this.zipCodeResult.forEach(geoDetail => {
            data.forEach(balance => {
              if (geoDetail.postalCode === balance['location']['zipCode']) {
                balance.distance = ((Number(geoDetail.distance) * 0.621371).toFixed(2)).toString();
                this.availabilityService.availableItems.push(balance);
              }
            })
          })
        }
        this.availabilityService.loading = false;
    }, error => {
      console.warn(error);
    })
  }

  getAvailableItemsByZipCode(prodId: number, zipCode: string, radius: number) {
    this.geoService.searchedByZipCode(zipCode, radius).then(
      data => {
        if (data.postalCodes) {
          this.zipCodeResult = data.postalCodes;
          this.getAllAvailableItems(0, prodId, 0, true);
        } else if (data.status.message.startsWith('no postal code')) {
          this.invalidZipCode.emit(); 
        }
      }
    )
  }

  emitErrorMsg() {
    return this.invalidZipCode;
  }
}
