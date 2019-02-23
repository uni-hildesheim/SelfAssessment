import { ResourcePipe } from './resource.pipe';
import { Resource } from '../models/resources/resources.model';
import { ResourceService } from 'src/app/core/services/resource.service';

describe('ResourcePipe', () => {

  const mockResource: Resource = {
    footer: 'footerContent',
    header: 'headerContent',
    language: 'English',
    name: 'SelfAssessment',
    strings: { },
    vendor: {
      logo: 'logo.svg',
      name: 'vendorName'
    }
  };

  const mockResourceService = {
    getResource() {
      return mockResource;
    }
  };

  const resourcePipe = new ResourcePipe(mockResourceService as ResourceService);

  it('should provide the correct resource', () => {
    expect(resourcePipe.transform('footer')).toEqual('footerContent');
    expect(resourcePipe.transform('header')).toEqual('headerContent');
    expect(resourcePipe.transform('language')).toEqual('English');
    expect(resourcePipe.transform('vendor', 'logo')).toEqual('logo.svg');
    expect(resourcePipe.transform('vendor', 'name')).toEqual('vendorName');
  });

});
