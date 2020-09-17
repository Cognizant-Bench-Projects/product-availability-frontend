import { Component, OnInit } from '@angular/core';
import { Department } from 'src/app/model/department';
import { Product } from 'src/app/model/product';
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

  selectedLocation: number = 0;
  selectedDepartment: number = 0;
  selectedProduct: number = 0;

  constructor(private deptService: DepartmentService, private productService: ProductService, private locationService: LocationService, private balanceService: BalanceService) { }

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
  }

  changeDept() {
    if (this.selectedDepartment == 0) {
      this.filterProducts = this.allProducts;
    } else {
      this.filterProducts = this.allProducts.filter(prod => prod.dept.id == this.selectedDepartment);
    }
  }

  filterByCondition() {
    this.balanceService.getAllAvailableItems(this.selectedDepartment, this.selectedProduct, this.selectedLocation);
  }

  clearFilter() {
    this.selectedDepartment = 0;
    this.selectedProduct = 0;
    this.selectedLocation = 0;
  }

}
