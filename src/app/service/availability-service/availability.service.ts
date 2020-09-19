import { Injectable } from '@angular/core';
import { Balance } from 'src/app/model/balance';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  loading: boolean = false;
  showDistance: boolean = false;
  availableItems: Array<Balance> = [];

  constructor() { }
}
