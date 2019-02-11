import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, TimeoutError, Subject, of } from 'rxjs';
import { timeout, retryWhen, map, switchMap } from 'rxjs/operators';
import { ErrorDialogService } from 'src/app/shared/services/error-dialog.service';
import { Injectable } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private dialogService: ErrorDialogService,
        private logging: LoggingService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request)
            .pipe(
                timeout(10000),
                retryWhen(
                    err =>
                        err.pipe(
                            switchMap(e => {
                                if (e.status === 404 || e.status === 500) {
                                    throw e;
                                } else {
                                    return this.dialogService.openDialog('Cannot reach server.');
                                }
                            })
                        )
                )

            );
    }
}
