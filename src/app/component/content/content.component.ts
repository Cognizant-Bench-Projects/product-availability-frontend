import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from 'src/app/service/availability-service/availability.service';
import { BalanceService } from 'src/app/service/balance-service/balance.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  ascending: boolean = true;

  constructor(private availabilityService: AvailabilityService, private balanceService: BalanceService) { }

  ngOnInit() {
    this.balanceService.getAllAvailableItems(0, 0, 0);
  }

  reorder(condition) {
    this.ascending = !this.ascending;
    
    if (condition === 'product') {
      this.availabilityService.availableItems.sort((a, b) => this.ascending ? (a.product.productName < b.product.productName ? -1 : 1) : (b.product.productName < a.product.productName ? -1 : 1));
    } else if (condition === 'location') {
      this.availabilityService.availableItems.sort((a, b) => this.ascending ? (a['location']['zipCode'] < b['location']['zipCode'] ? -1 : 1) : (b['location']['zipCode'] < a['location']['zipCode'] ? -1 : 1));
    } else {
      this.availabilityService.availableItems.sort((a, b) => this.ascending ? (a.distance < b.distance ? -1 : 1) : (b.distance < a.distance ? -1 : 1))
    }
  }

}
