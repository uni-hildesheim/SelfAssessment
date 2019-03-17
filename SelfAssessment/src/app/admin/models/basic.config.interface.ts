import { Language } from './language.model';

export interface BasicConfig {
  title: string;
  icon: string;
  schema: string;
  languages: Language[];
}
