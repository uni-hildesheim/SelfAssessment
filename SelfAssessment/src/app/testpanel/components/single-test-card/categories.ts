import { Category } from 'src/app/shared/models/procedure/enums/category.enum';
import { RadioButtonsComponent } from './categories/radio-buttons/radio-buttons.component';
import { MultipleOptionsComponent } from './categories/multiple-options/multiple-options.component';
import { MultipleChoiceComponent } from './categories/multiple-choice/multiple-choice.component';
import { Type } from '@angular/core';
import { CategoryComponent } from './categorie.component';
import { MatchComponent } from './categories/match/match.component';

/**
 * This class contains a method which returns a component type for a specific [Category]{@linkCategory},
 * to prevent the model from having an instance of the component type.
 */
export class ExistingCategories {

    /**
     * Returns a component type for a [Category]{@linkCategory}.
     * @param category The specific category.
     * @return The type for the category.
     */
    public static getNewComponent(category: Category): Type<CategoryComponent> {
      switch (category) {
          case Category.RADIO_BUTTONS:
              return RadioButtonsComponent;
          case Category.MULTIPLE_OPTIONS:
              return MultipleOptionsComponent;
          case Category.MULTIPLE_CHOICE:
              return MultipleChoiceComponent;
          case Category.MATCH:
              return MatchComponent;
      }
    }
}
