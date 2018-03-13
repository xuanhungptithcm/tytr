import { TestBed, inject } from '@angular/core/testing';

import { BehaviorService } from './behavior.service';

describe('BehaviorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BehaviorService]
    });
  });

  it('should be created', inject([BehaviorService], (service: BehaviorService) => {
    expect(service).toBeTruthy();
  }));
});
