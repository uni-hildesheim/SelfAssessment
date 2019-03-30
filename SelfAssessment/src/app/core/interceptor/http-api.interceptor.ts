import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * Http interceptor which completes the api url by prefixing the url from the enviroment file.
 */
@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const apiReq = request.clone({ url: `${environment.apiUrl}/${request.url}` });
        return next.handle(apiReq);
    }

}
