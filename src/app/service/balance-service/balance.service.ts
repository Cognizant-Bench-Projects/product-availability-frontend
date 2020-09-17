import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Balance } from 'src/app/model/balance';
import { environment } from '../../../environments/environment';
import { AvailabilityService } from '../availability-service/availability.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  url: string = `${environment.balanceUri}available-items`;

  constructor(private http: HttpClient, private availabilityService: AvailabilityService) { }

  getAllAvailableItems(deptId: number, prodId: number, locId: number) {
    this.availabilityService.loading = true;
    
    let httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };
    
    this.http.get<Balance[]>(`${this.url}?location=${locId}&product=${prodId}&department=${deptId}`, httpOption).toPromise().then(
      data => {
        this.availabilityService.availableItems = data;
        this.availabilityService.loading = false;
    }, error => {
      console.warn(error);
    })
  }
}
