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

  loadingData: boolean = true;
  loadingDataFailed: boolean = false;
  filterByLocation: boolean = true;
  validLocation: boolean = true;
  validDept: boolean = true;
  validProduct: boolean = true;
  validZipCode: boolean = true;
  validRadius: boolean = true;

  constructor(private deptService: DepartmentService, private productService: ProductService, private locationService: LocationService, private balanceService: BalanceService, private availabilityService: AvailabilityService) { }

  ngOnInit() {
    this.fetchAllData();
    this.balanceService.emitErrorMsg().subscribe(() => this.validZipCode = false);
  }

  fetchAllData() {
    this.loadingData = true;
    this.loadingDataFailed = false;
    let count = 0;

    this.deptService.getAllDepartments().then(
      data => {
        this.allDepartments = data;
        count++;
        if (count === 3) {
          this.loadingData = false;
        }
    }, error => {
      this.loadingData = false;
      this.loadingDataFailed = true;
    });

    this.productService.getAllProducts().then(
      data => {
        this.allProducts = data;
        this.filterProducts = data;
        count++;
        if (count === 3) {
          this.loadingData = false;
        }
    }, error => {
      this.loadingData = false;
      this.loadingDataFailed = true;
    });

    this.locationService.getAllLocations().then(
      data => {
        this.allLocations = data;
        count++;
        if (count === 3) {
          this.loadingData = false;
        }
    }, error => {
      this.loadingData = false;
      this.loadingDataFailed = true;
    });
  }

  changeDept() {
    this.validDept = true;
    this.validProduct = true;
    if (this.inputDept === '') {
      this.filterProducts = this.allProducts;
    } else {
      let dept = this.allDepartments.find(dept => dept.deptName === this.inputDept);
      this.filterProducts = !!dept ? this.allProducts.filter(prod => prod.dept.id === dept.id) : [];
    }
    if (!this.filterProducts.find(prod => prod.productName === this.inputProduct)) this.inputProduct = '';
  }

  filterByCondition() {
    this.resetErrorMsg();
    if (this.checkForInput()) {
      this.balanceService.getAllAvailableItems(0, false, 'id', true);
    }
  }

  clearFilter() {
    this.filterProducts = this.allProducts;
    this.inputLocation = '';
    this.inputDept = '';
    this.inputProduct = '';
    this.givenZipCode = '';
    this.givenRadius = 10;
    this.resetErrorMsg();
  }

  toggleSearchMethod() {
    this.filterByLocation = !this.filterByLocation;
    this.resetErrorMsg();
  }

  searchNearestLocation() {
    this.resetErrorMsg();
    this.givenRadius = this.givenRadius || 0;
    this.validRadius = this.givenRadius >= 0 && (this.availabilityService.unit === 'Mile' ? this.givenRadius <= 18.6 : this.givenRadius <= 30);
    this.validZipCode = /^\d{5}$/.test(this.givenZipCode);
    if (this.checkForInput() && this.validRadius && this.validZipCode) {
      this.balanceService.getAvailableItemsByZipCode(this.givenZipCode, this.givenRadius);
    }
  }

  checkForInput() {
    if (this.inputLocation) {
      let loc = this.allLocations.find(loc => loc.locName === this.inputLocation);
      if (!loc) {
        this.validLocation = false;
      } else this.balanceService.selectedLocation = loc;
    } else this.balanceService.selectedLocation = null;
    
    if (this.inputDept) {
      let dept = this.allDepartments.find(dept => dept.deptName === this.inputDept);
      if (!dept) {
        this.validDept = false;
      } else this.balanceService.selectedDepartment = dept;
    } else this.balanceService.selectedDepartment = null;
    
    if (this.inputProduct) {
      let prod = this.filterProducts.find(prod => prod.productName === this.inputProduct);
      if (!prod) {
        this.validProduct = false;
      } else this.balanceService.selectedProduct = prod;
    } else this.balanceService.selectedProduct = null;

    return this.validDept && this.validProduct && this.validLocation;
  }

  resetErrorMsg() {
    this.validDept = true;
    this.validLocation = true;
    this.validProduct = true;
    this.validZipCode = true;
    this.validRadius = true;
  }

  reload() {
    this.clearFilter();
    this.fetchAllData();
  }
}
