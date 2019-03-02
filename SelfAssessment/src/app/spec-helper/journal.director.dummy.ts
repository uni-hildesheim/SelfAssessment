import { JournalStructure } from 'src/app/shared/models/state/journal.structure.model';
import { JournalLog } from 'src/app/shared/models/state/journal.log.model';
import { JournalStructureMinimal } from './../shared/models/state/minimal/journal.structure.minimal';
import { ConfigFile } from './../shared/models/configuration/config.file.model';


export const formattedJournalLog = {
  'sets': [
     {
        'maps': [
           {
              'key': '1001',
              'val': [ false, false ]
           },
           {
              'key': '1002',
              'val': [
                 [ false, false, false ],
                 [ false, false, false ]
              ]
           }
        ]
     },
     {
        'maps': [
           {
              'key': '1005',
              'val': [ false, false, false ]
           },
           {
              'key': '1003',
              'val': [ false, false ]
           }
        ]
     }
  ]
};

export const extractedJournalLog = new JournalLog();
extractedJournalLog.sets = [
    new Map([
      ['1001', [false, false]],
      ['1002', [ [ false, false, false ], [ false, false, false ]] as any[]]
    ]),
    new Map([
      ['1005', [false, false, false]],
      ['1003', [false, false]]
    ])
  ];


export const minJournalStruc: JournalStructureMinimal = {
  course: 'IMIT',
  language: 'English',
  sets: [
    {
      set: '3001',
      tests: [
        '1002',
        '1003',
        '1005'
      ]
    }
  ]
};


export const randTestgroupsFile: ConfigFile = {
  title: '',
  icon: '',
  checksumRegex: '',
  tests: [
    {
      id: '1001',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1002',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1003',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1004',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1005',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
  ],
  testgroups: [
    {
      id: '2001',
      tests: [
        '1001', '1002', '1003'
      ],
      select: 2
    },
    {
      id: '2002',
      tests: [
        '1004', '1005'
      ],
      select: 1
    }
  ],
  sets: [
    {
      id: '3001',
      elements: ['2001', '2002'],
      evaluationTexts: {
        scoreIndependent: '',
        scoreDependent: [[100, '']]
      }
    }
  ],
  infopages: []
};

export const infopageFile: ConfigFile = {
  title: '',
  icon: '',
  checksumRegex: '',
  tests: [
    {
      id: '1001',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1002',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    },
    {
      id: '1003',
      description: '',
      category: 'radio-buttons',
      evaluated: true,
      task: '',
      type: '',
      options: []
    }
  ],
  testgroups: [
    {
      id: '2001',
      tests: ['1001']
    },
    {
      id: '2002',
      tests: ['1003']
    }
  ],
  infopages: [
    {
      id: '4001',
      text: 'Infopage for test',
      belongs: ['1002']
    },
    {
      id: '4002',
      text: 'Infopage for testgroup',
      belongs: ['2001']
    },
    {
      id: '4003',
      text: 'Infopage for set',
      belongs: ['3001']
    },
    {
      id: '4004',
      text: 'Infopage for test inside testgroup',
      belongs: ['1003']
    }
  ],
  sets: [
    {
      id: '3001',
      elements: ['2001', '1002', '2002'],
      evaluationTexts: {
        scoreIndependent: '',
        scoreDependent: [[100, '']]
      }
    }
  ],
};

export const file: ConfigFile = {
  title: 'IMIT',
  icon: 'imit.png',
  checksumRegex: '',
  tests: [
    {
      description: 'dummy radio button test',
      category: 'radio-buttons',
      evaluated: true,
      task: 'dummy radio task',
      id: '1001',
      type: 'dummyType',
      options: [
        {
          text: 'dummy first option',
          correct: true
        },
        {
          text: 'dummy first option',
          correct: false
        }
      ]
    },
    {
      description: 'dummy multiple choice test',
      category: 'multiple-choice',
      evaluated: true,
      task: 'dummy multiple choice task',
      id: '1002',
      type: 'dummyType',
      options: [
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
      ]
    },
    {
      description: 'dummy multiple options test',
      category: 'multiple-options',
      evaluated: true,
      task: 'dummy multiple options task',
      id: '1003',
      type: 'dummyType',
      header: ['Yes', 'No'],
      options: [
        {
          text: 'dummy first option',
          correct: '0'
        },
        {
          text: 'dummy seccond option',
          correct: '1'
        }
      ]
    },
    {
      description: 'dummy speed test',
      category: 'speed',
      seconds: 10,
      evaluated: true,
      task: 'dummy speed task',
      id: '1004',
      type: 'dummyType',
      options: [
        {
          text: 'dummy first option',
          correct: 'um'
        },
        {
          text: 'dummy second option',
          correct: 'se'
        }
      ]
    },
    {
      description: 'dummy radio button test nr 2',
      category: 'radio-buttons',
      evaluated: true,
      task: 'dummy radio task',
      id: '1005',
      type: 'dummyType',
      options: [
        {
          text: 'dummy first option',
          correct: true
        },
        {
          text: 'dummy first option',
          correct: false
        }
      ]
    },
    {
      description: 'dummy radio button test nr 3',
      category: 'radio-buttons',
      evaluated: true,
      task: 'dummy radio task',
      id: '1006',
      type: 'dummyType',
      options: [
        {
          text: 'dummy first option',
          correct: true
        },
        {
          text: 'dummy first option',
          correct: false
        }
      ]
    }
  ],
  infopages: [
    {
      'id': '4001',
      'text': 'infopage for radio-buttons test nr 2',
      'belongs': [
        '1005'
      ]
    },
    {
      'id': '4002',
      'text': 'infopage for testgroup',
      'belongs': [
        '2001'
      ]
    },
    {
      'id': '4003',
      'text': 'infopage for test set',
      'belongs': [
        '3001'
      ]
    }
  ],
  testgroups: [
    {
      id: '2001',
      tests: [
        '1001',
        '1003'
      ]
    }
  ],
  sets: [
    {
      id: '3001',
      elements: ['1002', '1003'],
      evaluationTexts: {
        scoreIndependent: 'score independent text of the second dummy set',
        scoreDependent: [
          [33, 'below average message'],
          [66, 'average message'],
          [90, 'above average message'],
          [100, 'everything correct message']
        ]
      }
    },
    {
      id: '3002',
      elements: ['1001', '1004'],
      evaluationTexts: {
        scoreIndependent: 'score independent text of the second dummy set',
        scoreDependent: [
          [33, 'below average message'],
          [66, 'average message'],
          [90, 'above average message'],
          [100, 'everything correct message']
        ]
      }
    }
  ]
};
