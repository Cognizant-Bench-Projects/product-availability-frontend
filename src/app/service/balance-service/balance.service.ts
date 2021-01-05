import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Balance } from 'src/app/model/balance';
import { BalanceList } from 'src/app/model/balanceList';
import { GeoInfo } from 'src/app/model/geoInfo';
import { environment } from '../../../environments/environment';
import { AvailabilityService } from '../availability-service/availability.service';
import { GeoService } from '../geo_api/geo.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  selectedLocation: number = 0;
  selectedDepartment: number = 0;
  selectedProduct: number = 0;

  searchedLocation: number = 0;
  searchedDepartment: number = 0;
  searchedProduct: number = 0;

  @Output() invalidZipCode: EventEmitter<any> = new EventEmitter<any>();
  url: string = `${environment.balanceUri}available-items`;
  zipCodeResult: GeoInfo[] = [];

  constructor(private http: HttpClient, private availabilityService: AvailabilityService, private geoService: GeoService) { }

  getAllAvailableItems(page: number, searchByZipCode: boolean, refilter: boolean, sortBy: string, isAscending: boolean) {

    this.availabilityService.loading = true;

    if (refilter) {
      this.searchedLocation = this.selectedLocation;
      this.searchedProduct = this.selectedProduct;
      this.searchedDepartment = this.selectedDepartment;
      this.availabilityService.sortBy = 'id';
    }

    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    let searchUrl = searchByZipCode 
              ? `${this.url}?location=0&product=${this.searchedProduct}&department=0&page=${page}`
              : `${this.url}?location=${this.searchedLocation}&product=${this.searchedProduct}&department=${this.searchedDepartment}&page=${page}&sortBy=${sortBy}&isAscending=${isAscending}`;
    
    this.http.get<BalanceList>(searchUrl, httpOption).toPromise().then(
      data => {
        if (!searchByZipCode) {
          this.availabilityService.showDistance = false;
          this.availabilityService.availableItems = data.balances;
          this.availabilityService.numberOfItem = data.count;
        } else {
          this.availabilityService.showDistance = true;
          this.availabilityService.availableItems = [];
          this.availabilityService.currentUnit = this.availabilityService.unit;

          this.zipCodeResult.forEach(geoDetail => {
            data.balances.forEach(balance => {
              if (geoDetail.postalCode === balance['location']['zipCode']) {
                this.availabilityService.unit === 'Mile'
                  ? balance.distance = ((Number(geoDetail.distance) * 0.621371).toFixed(2)).toString()
                  : balance.distance = (Number(geoDetail.distance).toFixed(2)).toString();
                this.availabilityService.availableItems.push(balance);
              }
            })
          })
          this.availabilityService.numberOfItem = this.availabilityService.availableItems.length;
        }
        this.availabilityService.totalPage = Math.ceil(this.availabilityService.numberOfItem / 8);
        if (page <= 0 || page > this.availabilityService.totalPage) this.availabilityService.currentPage = 1;
        this.availabilityService.loading = false;
    }, error => {
      console.warn(error);
    })
  }

  getAvailableItemsByZipCode(zipCode: string, radius: number) {
    this.geoService.searchedByZipCode(zipCode, radius).then(
      data => {
        if (data.postalCodes) {
          this.zipCodeResult = data.postalCodes;
          this.getAllAvailableItems(-1, true, true, 'id', true);
        } else if (data.status.message.startsWith('no postal code')) {
          this.invalidZipCode.emit(); 
        }
      }
    )
  }

  changePage(pageNum: number, sortBy: string, isAscending: boolean) {
    this.getAllAvailableItems(pageNum, false, false, sortBy, isAscending);
  }

  emitErrorMsg() {
    return this.invalidZipCode;
  }
}
