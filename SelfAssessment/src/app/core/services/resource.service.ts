import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Resource } from 'src/app/shared/models/resources/resources.model';
import { environment } from 'src/environments/environment';

/**
 * Service that handles all the logic relating to
 * the applications resources.
 */
@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  /**
   * Api url to load the applications resources.
   */
  public static readonly LOAD_RESOURCES = 'api/v1/frontend/resources';

  /**
   * The resource object.
   */
  public resource: Resource;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService,
    private logging: LoggingService
  ) { }

  /**
   * This method provides the language specific resource object.
   * If this object is not initalized, e.g the user reloaded the page,
   * the resource object is loaded from the local storage.
   *
   * @returns The resource object.
   */
  public getResource(): Resource {
    if (!this.resource) {
      this.resource = this.storage.getResources();
    }
    return this.resource;
  }

  /**
   * This method changes the language in the local
   * storage and initalizes the new language specific
   * resource object.
   *
   * @param lang The choosen language.
   */
  public changeLang(lang: string): void {
    this.storage.storeLanguage(lang);
    this.resource = this.storage.getResources();
  }

  /**
   * Loads all new necessary resources when the application starts.
   * Converts the raw resources from the backend to their respective
   * typescript objects.
   *
   * @returns The observable as a promise, which is resolved during the bootstrap process.
   */
  public loadResources(): Promise<any> {
    // this.storage.clearStorage();
    this.storage.storeLanguage(environment.defaultLanguage);

    return this.http.get('api/v1/frontend/resources')
      .pipe(
        map((data: Object[]) => data as Resource[]),
        tap(data => {
          this.logging.info('Loaded resources');
          this.logging.debug(undefined, data);

          // store the default-language-resources in the local storage
          this.storage.storeResources(data);

          // init the service resource variable
          this.resource = this.storage.getResources();
        })
      ).toPromise();
  }

}
