import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { RadioButtonsComponent } from './categories/radio-buttons/radio-buttons.component';
import { MultipleOptionsComponent } from './categories/multiple-options/multiple-options.component';
import { MultipleChoiceComponent } from './categories/multiple-choice/multiple-choice.component';
import { SpeedComponent } from './categories/speed/speed.component';
import { Type } from '@angular/core';
import { CategoryComponent } from './categorie.component';

export class ExistingCategories {

    public static getNewComponent(category: Category): Type<CategoryComponent> {
      switch (category) {
          case Category.RADIO_BUTTONS:
              return RadioButtonsComponent;
          case Category.MULTIPLE_OPTIONS:
              return MultipleOptionsComponent;
          case Category.MULTIPLE_CHOICE:
              return MultipleChoiceComponent;
          case Category.SPEED:
              return SpeedComponent;
      }
    }
}
