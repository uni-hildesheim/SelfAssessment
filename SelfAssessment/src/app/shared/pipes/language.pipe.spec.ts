import { LanguagePipe } from './language.pipe';
import { Resource } from '../models/resources/resources.model';
import { ResourceService } from 'src/app/core/services/resource.service';

describe('LanguagePipe', () => {

  const mockResource: Resource = {
    footer: '',
    header: '',
    language: '',
    name: '',
    strings: {
      'btn-start': 'Start',
      'lbl-pin-request': 'Please input your pin.',
      'lbl-not-valid-pin': 'Not a valid pin.'
    },
    vendor: {
      logo: '',
      name: ''
    }
  };

  const mockResourceService = {
    getResource() {
      return mockResource;
    }
  };

  const langPipe = new LanguagePipe(mockResourceService as ResourceService);

  it('should translate the refs', () => {
    expect(langPipe.transform('btn-start')).toEqual('Start');
    expect(langPipe.transform('lbl-pin-request')).toEqual('Please input your pin.');
    expect(langPipe.transform('lbl-not-valid-pin')).toEqual('Not a valid pin.');
  });

});
