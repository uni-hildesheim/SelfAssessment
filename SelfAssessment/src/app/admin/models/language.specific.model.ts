import { Language } from './language.model';
import { TestOption } from 'src/app/shared/models/procedure/testoption.model';

export interface LanguageSpecific {
  language: Language;
  description: string;
  task: string;
  type: string;
  options: TestOption[];
  header?: string[];
}
