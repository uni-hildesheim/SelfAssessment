import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LoggingService } from 'src/app/shared/logging/logging.service';
import { Resource } from 'src/app/shared/models/resources/resources.model';
import { environment } from 'src/environments/environment';
import { StorageItem } from 'src/app/shared/services/local.storage.values.enum';

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
      this.getResources().then(val => this.resource = val);
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
  public async changeLang(lang: string) {
    localStorage.setItem(StorageItem.LANGUAGE, lang);
    this.resource = await this.getResources();
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
    localStorage.setItem(StorageItem.LANGUAGE, environment.defaultLanguage);

    return this.http.get('api/v1/frontend/resources')
      .pipe(
        map((data: Object[]) => data as Resource[]),
        tap(data => {
          this.logging.info('Loaded resources');
          this.logging.debug(undefined, data);

          // store the default-language-resources in the local storage
          localStorage.setItem(StorageItem.RESOURCES, JSON.stringify(data));

          // init the service resource variable
          this.getResources().then(val => this.resource = val);
        })
      ).toPromise();
  }

  public getResources(): Promise<Resource> {

    return new Promise((resolve, reject) => {
      let res: Resource;
      const lang = localStorage.getItem(StorageItem.LANGUAGE);
      const resources = (<Resource[]>JSON.parse(localStorage.getItem(StorageItem.RESOURCES)));

      if (!resources) {
        this.loadResources().then(
          data => {
            localStorage.setItem(StorageItem.LANGUAGE, lang);
            res = data.find(e => e.language === lang);
            resolve(res);
          }
        );
      } else {
        res = resources.find(e => e.language === lang);
        resolve(res);
      }
    });

  }

}
