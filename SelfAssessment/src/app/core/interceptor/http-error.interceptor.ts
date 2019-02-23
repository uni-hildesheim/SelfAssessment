import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, retryWhen, switchMap } from 'rxjs/operators';
import { ErrorDialogService } from 'src/app/shared/services/error-dialog.service';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private dialogService: ErrorDialogService
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

                                    return this.dialogService.openDialog(errorResponse.message);
                                } else if (e.status === 0) {
                                    return this.dialogService.openDialog('Cannot reach server.');
                                } else {
                                    return this.dialogService.openDialog('Unkown Error.');
                                }
                            })
                        )
                )

            );
    }
}
