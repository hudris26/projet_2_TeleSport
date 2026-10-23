import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { Olympic } from '../models/olympic';

describe('DataService', () => {
  let service: DataService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()]
  });

  httpTestingController = TestBed.inject(HttpTestingController);
  service = TestBed.inject(DataService);
  });

  it('should request olympic data', () => {
    let receivedData: Olympic[] | undefined;

    service.getOlympics().subscribe(data => receivedData = data);

    const request = httpTestingController.expectOne('./assets/mock/olympic.json');
    expect(request.request.method).toBe('GET');

    const expectedData: Olympic[] = [{
      id: 1,
      country: 'Italy',
      participations: [{
        id: 1,
        year: 2012,
        city: 'Londres',
        medalsCount: 28,
        athleteCount: 372
      }]
    }];

    request.flush(expectedData);
    expect(receivedData).toEqual(expectedData);
  });
});

