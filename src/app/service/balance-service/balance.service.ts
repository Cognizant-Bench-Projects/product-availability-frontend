import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BalanceList } from 'src/app/model/balanceList';
import { Department } from 'src/app/model/department';
import { GeoInfo } from 'src/app/model/geoInfo';
import { Location } from 'src/app/model/location';
import { Product } from 'src/app/model/product';
import { environment } from '../../../environments/environment.prod';
import { AvailabilityService } from '../availability-service/availability.service';
import { GeoService } from '../geo_api/geo.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  selectedLocation: Location = null;
  selectedDepartment: Department = null;
  selectedProduct: Product = null;
  searchedZipcode: string = '';
  searchedRadius: number = 0;

  @Output() invalidZipCode: EventEmitter<any> = new EventEmitter<any>();
  url: string = `${environment.balanceUri}available-items`;
  zipCodeResult: GeoInfo[] = [];

  constructor(private http: HttpClient, private availabilityService: AvailabilityService, private geoService: GeoService) { }

  getAllAvailableItems(page: number, searchByZipCode: boolean, sortBy: string, isAscending: boolean) {

    this.availabilityService.connectFailed = false;
    this.availabilityService.loading = true;
    this.availabilityService.searchMethod = searchByZipCode;

    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    let locId = this.selectedLocation ? this.selectedLocation.id : 0;
    let deptId = this.selectedDepartment ? this.selectedDepartment.id : 0;
    let prodId = this.selectedProduct ? this.selectedProduct.id : 0;
    let searchUrl = searchByZipCode 
              ? `${this.url}?location=0&product=${prodId}&department=0&page=${page}`
              : `${this.url}?location=${locId}&product=${prodId}&department=${deptId}&page=${page}&sortBy=${sortBy}&isAscending=${isAscending}`;
    
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
      this.availabilityService.loading = false;
      this.availabilityService.connectFailed = true;
    })
  }

  getAvailableItemsByZipCode(zipCode: string, radius: number) {
    this.geoService.searchedByZipCode(zipCode, radius).then(
      data => {
        if (data.postalCodes) {
          this.zipCodeResult = data.postalCodes;
          this.searchedZipcode = zipCode;
          this.searchedRadius = radius;
          this.getAllAvailableItems(-1, true, 'id', true);
        } else if (data.status.message.startsWith('no postal code')) {
          this.invalidZipCode.emit(); 
        }
      }
    )
  }

  changePage(pageNum: number, sortBy: string, isAscending: boolean) {
    this.getAllAvailableItems(pageNum, false, sortBy, isAscending);
  }

  emitErrorMsg() {
    return this.invalidZipCode;
  }
}
