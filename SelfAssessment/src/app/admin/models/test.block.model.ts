import { LanguageSpecific } from './language.specific.model';
import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';

export interface TestBlock {
  id: string;
  elementType: SetElementType;
  category: Category;
  evaluated: boolean;
  langSpecific: LanguageSpecific[];
}
