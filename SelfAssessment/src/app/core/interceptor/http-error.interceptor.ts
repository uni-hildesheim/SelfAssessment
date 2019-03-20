import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, retryWhen, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MaterialOverlayService } from 'src/app/shared/services/helper/material-overlay.service';

/**
 * Interceptor which handles error from the backend.
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  /**
   * Constructor injecting the dialog service which is used to provide the retry functionality.
   */
  constructor(private dialogService: MaterialOverlayService) {}

  /**
   * If at any point the frontend receives an error from the backend (http response), a
   * dialog opens which shows the specific error type which can be one of the following:
   *
   * 1. **E_UNKOWN**: Unknown error
   * 2. **E_ACCESS**: Permission denied
   * 3. **E_DBIO**: DB input/output error
   * 4. **E_DBQUERY**: No element found in DB
   * 5. **E_INVAL**: Invalid request parameters
   *
   * Regardless of the error the application displays a dialog which tells the user the specific
   * error message and provides an option to retry the failed request.
   * If the backend is completely unavailable the dialog is also being opened.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      timeout(10000),
      retryWhen(err =>
        err.pipe(
          switchMap(e => {
            if (e.status === 404) {
              throw e;
            } else if (e.status === 500) {
              let errorResponse = e.error.error;

              if (!errorResponse) {
                errorResponse = {};
                errorResponse.number = 0;
                errorResponse.message = 'Unknown error';
              }

              return this.dialogService.openErrorDialog(errorResponse.message);
            } else if (e.status === 0) {
              return this.dialogService.openErrorDialog('Cannot reach server.');
            } else {
              return this.dialogService.openErrorDialog('Unkown Error.');
            }
          })
        )
      )
    );
  }
}
