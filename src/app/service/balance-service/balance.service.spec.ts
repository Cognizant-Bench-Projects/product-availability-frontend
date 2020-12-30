import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BalanceService } from './balance.service';

describe('BalanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: BalanceService = TestBed.get(BalanceService);
    expect(service).toBeTruthy();
  });
});
