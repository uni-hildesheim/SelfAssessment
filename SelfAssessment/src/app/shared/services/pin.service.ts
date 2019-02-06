import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root'
})
export class PinService {

  public static readonly CREATE_PIN = environment.apiUrl + '/api/v1/pincode/create';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private logging: LoggingService
  ) { }

  createNewPin(): Observable<number> {
    const checkPin = this.storageService.getPin();

    if (checkPin) {
      return of(checkPin);
    }

    return this.http.get(PinService.CREATE_PIN).pipe(
      map((pin: number) => {
        this.storageService.storePin(pin);
        return pin;
      }),
      tap((pin: number) => {
        this.logging.info(`Loaded pin: ${pin}`);
      })
    );
  }
}
