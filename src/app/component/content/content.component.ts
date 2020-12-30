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
    this.balanceService.getAllAvailableItems(0, false, true);
  }

  reorder(condition) {
    if (condition === 'distance') {
      this.availabilityService.availableItems.sort((a, b) => this.ascending ? (Number(a.distance) < Number(b.distance) ? -1 : 1) : (Number(b.distance) < Number(a.distance) ? -1 : 1))
    } else {
      // amount
    }
    this.ascending = !this.ascending;
  }

  changePage(pageNum: number) {
    this.availabilityService.currentPage = pageNum;
    this.balanceService.changePage(pageNum - 1);
  }

}
