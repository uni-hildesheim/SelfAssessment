import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from 'src/app/core/services/resource.service';

/**
 * Displays the language specific resource information.
 */
@Pipe({
  name: 'language',
  pure: false
})
export class LanguagePipe implements PipeTransform {

  constructor(
    private resourceService: ResourceService
  ) { }

  transform(val: string): any {
    return this.resourceService.getResource().strings[val];
  }

}
