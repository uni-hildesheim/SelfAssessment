import { Journal } from 'src/app/shared/models/state/journal.model';
import { ConfigFile } from './../shared/models/configuration/config.file.model';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { JournalStructure } from './../shared/models/state/journal.structure.model';
import { MultipleOptions } from 'src/app/shared/models/procedure/categories/multiple.options.test';
import { MultipleChoice } from './../shared/models/procedure/categories/multiple.choice.test';
import { SetElementType } from 'src/app/shared/models/procedure/enums/element.type.enum';
import { RadioButtons } from 'src/app/shared/models/procedure/categories/radio.buttons.test';
import { Category } from '../shared/models/procedure/enums/category.enum';
import { Match } from '../shared/models/procedure/categories/match.test';
import { TestSet } from '../shared/models/procedure/testset.model';
import { ResultSet } from '../shared/models/evaluation/result.set';

export const dummyTestRadioButtons: RadioButtons = new RadioButtons();
  dummyTestRadioButtons.description = 'dummy radio button test';
  dummyTestRadioButtons.category = Category.RADIO_BUTTONS;
  dummyTestRadioButtons.elementType = SetElementType.TEST;
  dummyTestRadioButtons.evaluated = true;
  dummyTestRadioButtons.task = 'dummy radio task';
  dummyTestRadioButtons.id = '1001';
  dummyTestRadioButtons.type = 'dummyType';
  dummyTestRadioButtons.options = [
    {
      text: 'dummy first option',
      correct: true
    },
    {
      text: 'dummy first option',
      correct: false
    }
  ];

  export const dummyTestMultipleChoice: MultipleChoice = new MultipleChoice();
dummyTestMultipleChoice.description = 'dummy multiple choice test';
dummyTestMultipleChoice.category = Category.MULTIPLE_CHOICE;
dummyTestMultipleChoice.elementType = SetElementType.TEST;
dummyTestMultipleChoice.evaluated = true;
dummyTestMultipleChoice.task = 'dummy multiple choice task';
dummyTestMultipleChoice.id = '1002';
dummyTestMultipleChoice.type = 'dummyType';
dummyTestMultipleChoice.options = [
    {
      text: 'dummy first option',
      correct: true
    },
    {
      text: 'dummy first option',
      correct: true
    },
    {
      text: 'dummy third option',
      correct: false
    }
  ];


  export const dummyTestMultipleOptions: MultipleOptions = new MultipleOptions();
  dummyTestMultipleOptions.description = 'dummy multiple options test';
  dummyTestMultipleOptions.category = Category.MULTIPLE_OPTIONS;
  dummyTestMultipleOptions.elementType = SetElementType.TEST;
  dummyTestMultipleOptions.evaluated = true;
  dummyTestMultipleOptions.task = 'dummy multiple options task';
  dummyTestMultipleOptions.id = '1003';
  dummyTestMultipleOptions.type = 'dummyType';
  dummyTestMultipleOptions.header = ['Yes', 'No'];
  dummyTestMultipleOptions.options = [
    {
      text: 'dummy first option',
      correct: '0'
    },
    {
      text: 'dummy seccond option',
      correct: '1'
    }
  ];

export const dummyMatchTest = new Match();

dummyMatchTest.description = 'dummy speed test';
dummyMatchTest.category = Category.MATCH;
dummyMatchTest.elementType = SetElementType.TEST;
dummyMatchTest.seconds = 10;
dummyMatchTest.evaluated = true;
dummyMatchTest.task = 'dummy speed task';
dummyMatchTest.id = '1004';
dummyMatchTest.type = 'dummyType';
dummyMatchTest.options = [
    {
      text: 'dummy first option',
      correct: 'um'
    },
    {
      text: 'dummy second option',
      correct: 'se'
    }
  ];

const dummyFirstSet = new TestSet();
dummyFirstSet.id = '3001';
dummyFirstSet.elements = [dummyTestMultipleChoice, dummyTestMultipleOptions];
dummyFirstSet.scoreIndepentText =  'score independent text of the first dummy set';
dummyFirstSet.scoreDependentTexts =  [
  [33, 'below average message'],
  [66, 'average message'],
  [90, 'above average message'],
  [100, 'everything correct message']];

const dummySecondSet = new TestSet();
dummySecondSet.id = '3002';
dummySecondSet.elements = [dummyMatchTest, dummyTestRadioButtons];
dummySecondSet.scoreIndepentText =  'score independent text of the second dummy set';
dummySecondSet.scoreDependentTexts =  [
  [33, 'below average message'],
  [66, 'average message'],
  [90, 'above average message'],
  [100, 'everything correct message']];

export const dummyJournalStructure = new JournalStructure();
dummyJournalStructure.sets = [dummyFirstSet, dummySecondSet];

export const firstSetLog = new Map([
  ['1001', [false, true]],
  ['1004', ['ummy', 'se'] as any[]]
]);

export const secondSetLog = new Map([
  ['1002', [false, true, false]],
  ['1003', [[false, true], [true, false]] as any[]]
]);

export const dummyJournalLog = new JournalLog();
dummyJournalLog.sets = [firstSetLog, secondSetLog];


export const dummyJournal = new Journal();
dummyJournal.structure = dummyJournalStructure;
dummyJournal.log = dummyJournalLog;



export const resultSetDummy: ResultSet[] = [
  {
    id: '3001',
    tests: [
      {
        id: '1001',
        score: 0,
        maxScore: 1,
        correctOptions: [],
        wrongOptions: [0],
        singleTest: dummyTestRadioButtons,
        log: firstSetLog.get('1001')
      },
      {
        id: '1004',
        score: 1,
        maxScore: 2,
        correctOptions: [1],
        wrongOptions: [0],
        singleTest: dummyMatchTest,
        log: firstSetLog.get('1004')
      }
    ]
  },
  {
    id: '3002',
    tests: [
      {
        id: '1002',
        score: 0,
        maxScore: 2,
        correctOptions: [1],
        wrongOptions: [0],
        singleTest: dummyTestMultipleChoice,
        log: secondSetLog.get('1002')
      },
      {
        id: '1003',
        score: 0,
        maxScore: 2,
        correctOptions: [],
        wrongOptions: [0, 1],
        singleTest: dummyTestMultipleOptions,
        log: secondSetLog.get('1003')
      }
    ]
  }
];
