import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PinService {

  private static readonly CREATE_PIN = environment.apiUrl + '/api/v1/pincode/create';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) { }

  createNewPin(): Observable<number> {
    const checkPin = this.storageService.getPin();

    if (checkPin) {
      return of(checkPin);
    }

    return this.http.get(PinService.CREATE_PIN).pipe(
      map((pin: number) => {
        localStorage.setItem('pin', pin.toString());
        return pin;
      })
    );
  }
}
