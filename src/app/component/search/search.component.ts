import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/model/department';
import { Product } from 'src/app/model/product';
import { Location } from 'src/app/model/location';
import { AvailabilityService } from 'src/app/service/availability-service/availability.service';
import { BalanceService } from 'src/app/service/balance-service/balance.service';
import { DepartmentService } from 'src/app/service/department-service/department.service';
import { LocationService } from 'src/app/service/location-service/location.service';
import { ProductService } from 'src/app/service/product-service/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  allLocations: Array<Location> = [];
  allDepartments: Array<Department> = [];
  allProducts: Array<Product> = [];
  filterProducts: Array<Product> = [];

  inputLocation: string = '';
  inputDept: string = '';
  inputProduct: string = '';
  givenZipCode: string = '';
  givenRadius: number = 10;

  filterByLocation: boolean = true;
  validLocation: boolean = true;
  validDept: boolean = true;
  validProduct: boolean = true;
  validZipCode: boolean = true;
  validRadius: boolean = true;

  constructor(private deptService: DepartmentService, private productService: ProductService, private locationService: LocationService, private balanceService: BalanceService, private availabilityService: AvailabilityService) { }

  ngOnInit() {
    this.deptService.getAllDepartments().then(
      data => {
        this.allDepartments = data;
    }, error => {
      console.warn(error);
    });

    this.productService.getAllProducts().then(
      data => {
        this.allProducts = data;
        this.filterProducts = data;
    }, error => {
      console.warn(error);
    });

    this.locationService.getAllLocations().then(
      data => {
        this.allLocations = data;
    }, error => {
      console.warn(error);
    });

    this.balanceService.emitErrorMsg().subscribe(() => this.validZipCode = false);
  }

  changeDept() {
    this.balanceService.selectedProduct = null;
    if (this.balanceService.selectedDepartment == null) {
      this.filterProducts = this.allProducts;
    } else {
      this.filterProducts = this.allProducts.filter(prod => prod.dept.id == this.balanceService.selectedDepartment.id);
    }
  }

  filterByCondition() {
    if (this.checkForInput()) {
      this.balanceService.getAllAvailableItems(0, false, true, 'id', true);
    }
  }

  clearFilter() {
    this.filterProducts = this.allProducts;
    this.inputLocation = '';
    this.inputDept = '';
    this.inputProduct = '';
    this.givenZipCode = '';
    this.givenRadius = 10;
    this.validDept = true;
    this.validLocation = true;
    this.validProduct = true;
    this.validZipCode = true;
    this.validRadius = true;
  }

  toggleSearchMethod() {
    this.filterByLocation = !this.filterByLocation;
    this.validDept = true;
    this.validLocation = true;
    this.validProduct = true;
    this.validZipCode = true;
    this.validRadius = true;
  }

  searchNearestLocation() {
    this.givenRadius = this.givenRadius || 0;
    this.validRadius = this.givenRadius >= 0 && (this.availabilityService.unit === 'Mile' ? this.givenRadius <= 18.6 : this.givenRadius <= 30);
    this.validZipCode = /^\d{5}$/.test(this.givenZipCode);
    if (this.validZipCode && this.validZipCode) {
      this.balanceService.getAvailableItemsByZipCode(this.givenZipCode, this.givenRadius);
    }
  }

  checkForInput() {
    this.validDept = true;
    this.validLocation = true;
    this.validProduct = true;
    if (this.inputLocation) {
      let loc = this.allLocations.find(loc => loc.locName === this.inputLocation);
      if (!loc) {
        this.validLocation = false;
        return false;
      } else this.balanceService.selectedLocation = loc;
    } else this.balanceService.selectedLocation = null;

    return true;
  }
}
