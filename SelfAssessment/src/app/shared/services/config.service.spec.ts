import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';
import { HttpClientModule } from '@angular/common/http';

xdescribe('TestDefinitionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
    }).compileComponents();
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });
});
