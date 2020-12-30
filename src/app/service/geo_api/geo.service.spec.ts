import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeoService } from './geo.service';
import { GeoAPI } from 'src/app/model/geoAPI';

describe('GeoService', () => {

  let service: GeoService;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeoService]
    }),
    service = TestBed.get(GeoService);
  });

  afterEach(() => {
    spy = null;
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return array of location when zip code is valid', () => {
    const result: GeoAPI = new GeoAPI();
    result.postalCodes = [
      {
        adminCode2: '113',
        adminCode3: '',
        adminName3: '',
        adminCode1: 'TX',
        adminName2: 'Dallas',
        lng: -96.959817,
        distance: '0',
        countryCode: 'US',
        postalCode: '75063',
        adminName1: 'Texas',
        placeName: 'Irving',
        lat: 32.924686
      }
    ];

    spy = spyOn(service, 'searchedByZipCode').and.returnValue(Promise.resolve(result));
    service.searchedByZipCode('75063', 1).then(value => {
      expect(value.postalCodes[0].postalCode).toBe('75063');
    });
    expect(service.searchedByZipCode).toHaveBeenCalled();
  });

  it('should return error message when zip code is invalid', () => {
    const result: GeoAPI = new GeoAPI();
    result.status = {
      message: 'no postal code found for postalcode=00000',
      value: 17
    };

    spy = spyOn(service, 'searchedByZipCode').and.returnValue(Promise.resolve(result));
    service.searchedByZipCode('00000', 10).then(value => {
      expect(value.status.message).toContain('no postal code');
    });
    expect(service.searchedByZipCode).toHaveBeenCalled();
  });

});
