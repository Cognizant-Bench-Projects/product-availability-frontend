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
  inputPageNum: number;

  constructor(private availabilityService: AvailabilityService, private balanceService: BalanceService) { }

  ngOnInit() {
    this.balanceService.getAllAvailableItems(0, false, true, 'id', true);
  }

  reorder(condition) {
    this.ascending = !this.ascending;
    if (condition === 'distance') {
      this.availabilityService.availableItems.sort((a, b) => this.ascending ? (Number(a.distance) < Number(b.distance) ? -1 : 1) : (Number(b.distance) < Number(a.distance) ? -1 : 1))
    } else if (condition === 'amount') {
      if (this.availabilityService.showDistance) {
        this.availabilityService.availableItems.sort((a, b) => this.ascending ? (a.amount < b.amount ? -1 : 1) : (b.amount < a.amount ? -1 : 1));
      } else {
        this.availabilityService.sortBy = condition;
        this.balanceService.getAllAvailableItems(0, false, false, condition, this.ascending);
      }
    }
  }

  changePage(pageNum: number) {
    if (pageNum > this.availabilityService.totalPage) pageNum = this.availabilityService.totalPage;
    this.availabilityService.currentPage = pageNum;
    this.balanceService.changePage(pageNum - 1, this.availabilityService.sortBy, this.ascending);
  }

  removeCondition(condition) {
    if (condition === 'dept') {
      this.balanceService.searchedDepartment = null;
    } else if (condition === 'prod') {
      this.balanceService.searchedProduct = null;
    } else if (condition === 'loc') {
      this.balanceService.searchedLocation = null;
    }
    this.balanceService.getAllAvailableItems(0, false, true, 'id', true, true);
  }

}
