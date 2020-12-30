import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ContentComponent } from './content.component';
import { BalanceService } from 'src/app/service/balance-service/balance.service';
import { AvailabilityService } from 'src/app/service/availability-service/availability.service';
import { Balance } from 'src/app/model/balance';
import { BalanceId } from 'src/app/model/balanceId';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let mockBalanceService: jasmine.SpyObj<BalanceService>;
  let availabilityService: AvailabilityService;

  beforeEach(async(() => {
    mockBalanceService = jasmine.createSpyObj('balanceService', ['getAllAvailableItems']);

    TestBed.configureTestingModule({
      declarations: [ 
        ContentComponent,
        LoadingSpinnerComponent
      ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: BalanceService, useValue: mockBalanceService},
        AvailabilityService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    availabilityService = new AvailabilityService();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be called', () => {
    mockBalanceService.getAllAvailableItems.and.returnValue();
    expect(mockBalanceService.getAllAvailableItems).toHaveBeenCalled();
  });

  // it('it should reorder the available items by product', () => {
  //   availabilityService.availableItems = [
  //     {"id":{"productId":1,"locationId":1},"product":{"id":1,"productName":"Long Sleeves","dept":{"id":1,"deptName":"Shirts"}},"location":{"id":1,"locName":"Irving","zipCode":"75063"},"amount":10},
  //     {"id":{"productId":2,"locationId":1},"product":{"id":2,"productName":"Short Sleeves","dept":{"id":1,"deptName":"Shirts"}},"location":{"id":1,"locName":"Irving","zipCode":"75063"},"amount":20},
  //     {"id":{"productId":5,"locationId":2},"product":{"id":5,"productName":"Crew Neck","dept":{"id":2,"deptName":"Sweater"}},"location":{"id":2,"locName":"New York","zipCode":"10024"},"amount":2}
  //   ];
  // })
});
