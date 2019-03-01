import { StorageItem } from './local.storage.values.enum';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { LoggingService } from '../logging/logging.service';

/**
 * Contains the logic for all pin-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class CodeService {

  /**
   * Api route that creates a new pin.
   */
  public static readonly CREATE_PIN = 'api/v1/user/create';

  public static readonly CREATE_VALIDATION_CODE = 'api/v1/result/lock';

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService,
    private logging: LoggingService
  ) { }


  /**
   * Retrieves generated pin from the database or locally stored pin.
   *
   * @returns Observable containing generated pin.
   */
  public createNewPin(): Observable<any> {
    const checkPin = this.storageService.checkPinInStorage();

    if (checkPin) {
      return of(checkPin);
    }

    return this.http.get(CodeService.CREATE_PIN).pipe(
      map((pin: number) => {
        this.storageService.persistInStorage(StorageItem.PIN, pin);
        return pin;
      }),
      tap((pin: number) => {
        this.logging.info(`Loaded pin: ${pin}`);
      })
    );
  }


  public createNewValidationCode(pin: number): Observable<string> {
    return this.http.post(CodeService.CREATE_VALIDATION_CODE, { pin })
    .pipe(
      tap((code: string) => {
        this.logging.info(`Loaded validation code: ${code}`);
      })
    );
  }


}
