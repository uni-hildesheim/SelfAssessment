import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { LanguageSpecificInfoText } from './language.specific.infopage.text';

export class InfopageBlock {

  elementType: SetElementType = SetElementType.INFOPAGE;

  id: string;

  text: LanguageSpecificInfoText[];

  belongs: any[];

}
