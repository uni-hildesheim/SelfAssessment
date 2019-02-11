import { Pipe, PipeTransform } from '@angular/core';
import { ResourceService } from 'src/app/core/services/resource.service';

/**
 * Displays the application-specific (non language)
 * resource attributes.
 */
@Pipe({
  name: 'resources'
})
export class ResourcePipe implements PipeTransform {

  constructor(
    private resourceService: ResourceService
  ) { }

  transform(value: any, args?: any): any {
    if (args) {
      return this.resourceService.getResource()[value][args];
    } else {
      return this.resourceService.getResource()[value];
    }
  }

}
