import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { LoggingService } from 'src/app/shared/logging/logging.service';

@Injectable()
export class HttpLoggingInterceptor implements HttpInterceptor {

    constructor(
        private logging: LoggingService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.logging.debug('Initiating api call: ', this.createLogableMessage(request));
        return next.handle(request)
            .pipe(
                tap(
                    success => {
                        if (success instanceof HttpResponse) {
                            this.logging.debug('Api call sucessfull: ', this.createLogableMessage(success));
                        }
                    },
                    error => {
                        this.logging.error('Api call unsucessfull: ', this.createLogableMessage(error));

                    }
                )
            );
    }

    createLogableMessage(event: HttpEvent<any> | HttpRequest<any>) {
        let message = {};

        if (event instanceof HttpErrorResponse) {
            message = {
                'url': event.url,
                'message': event.message
            };
        } else if (event instanceof HttpResponse) {
            message = {
                'url': event.url,
                'status': event.status
            };
        } else if (event instanceof HttpRequest) {
            message = {
                'url': event.url,
                'method': event.method
            };
        }

        return message;
    }
}
