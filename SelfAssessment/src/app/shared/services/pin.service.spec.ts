import { TestBed } from '@angular/core/testing';

import { PinService } from './pin.service';
import { HttpClientModule } from '@angular/common/http';

describe('PinService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientModule]}));

  it('should be created', () => {
    const service: PinService = TestBed.get(PinService);
    expect(service).toBeTruthy();
  });
});
