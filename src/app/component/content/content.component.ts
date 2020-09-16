import { Component, OnInit } from '@angular/core';
import { AvailabilityService } from 'src/app/service/availability-service/availability.service';
import { BalanceService } from 'src/app/service/balance-service/balance.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  constructor(private availabilityService: AvailabilityService, private balanceService: BalanceService) { }

  ngOnInit() {
    this.balanceService.getAllAvailableItems();
  }

}
