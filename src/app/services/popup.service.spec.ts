import { TestBed, inject } from '@angular/core/testing';

import { Popup.ServiceService } from './popup.service.service';

describe('Popup.ServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Popup.ServiceService]
    });
  });

  it('should be created', inject([Popup.ServiceService], (service: Popup.ServiceService) => {
    expect(service).toBeTruthy();
  }));
});
