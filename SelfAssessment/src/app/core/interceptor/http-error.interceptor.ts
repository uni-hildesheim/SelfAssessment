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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private dialogService: MaterialOverlayService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                timeout(10000),
                retryWhen(
                    err =>
                        err.pipe(
                            switchMap(e => {
                                if (e.status === 404 ) {
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
