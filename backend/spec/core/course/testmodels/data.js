const MultipleChoiceTestConfig = {
    id: 1001,
    type: "logic",
    category: "multiple-choice",
    description: "",
    task: "",
    options: [
        {
            text: "A",
            correct: true
        },
        {
            text: "B"
        }
    ],
    evaluated: false
};

const MultipleOptionTestConfig = {
    id: 1002,
    type: "logic",
    category: "multiple-options",
    description: "",
    task: "",
    options: [{
        text: "",
        correct: 0
    }],
    evaluated: false,
    header: [
        "Yes",
        "No",
        "Maybe"
    ]
};

const RadioButtonTestConfig = {
    id: 1003,
    type: "logic",
    category: "radio-buttons",
    description: "",
    task: "",
    options: [{
        text: "",
        correct: true
    }],
    evaluated: false
};

const MatchTestConfig = {
    id: 1004,
    type: "logic",
    category: "match",
    description: "",
    task: "",
    options: [{
        text: "ABC DEF GHI DEF",
        correct: "DEF",
        index: "1"
    }, {
        text: "Yes No Maybe",
        correct: " ",
        index: "0"
    },
    {
        text: "McMahon, M (2002). Using qualitative assessment in career counselling. International Journal for Educational and Vocational Guidance, 2(6), 51-66. ",
        correct: " ",
        index: "1"
    }],
    evaluated: false,
    seconds: 10
};

module.exports = {
    configs: {
        'multiple-choice': MultipleChoiceTestConfig,
        'multiple-options': MultipleOptionTestConfig,
        'radio-buttons': RadioButtonTestConfig,
        'match': MatchTestConfig
    }
}
