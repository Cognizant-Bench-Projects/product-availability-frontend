import { Injectable } from '@angular/core';
import { Balance } from 'src/app/model/balance';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {

  loading: boolean = false;
  showDistance: boolean = false;
  availableItems: Array<Balance> = [];
  numberOfItem: number = 0;
  totalPage: number = 1;
  currentPage: number = 1;
  sortBy: string = 'id';
  unit: string = 'Mile';
  currentUnit: string = 'Mile';
  connectFailed: boolean = false;
  searchMethod: boolean;

  constructor() { }
}
