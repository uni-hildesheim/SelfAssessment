const CheckboxTestConfig = {
    id: 1001,
    type: "logic",
    category: "checkbox",
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
        text: ""
    }],
    evaluated: false
};

const SpeedTestConfig = {
    id: 1004,
    type: "logic",
    category: "speed",
    description: "",
    task: "",
    options: [{
        text: "ABC DEF GHI",
        correct: "DEF"
    }],
    evaluated: false,
    seconds: 10
};

module.exports = {
    configs: {
        'checkbox': CheckboxTestConfig,
        'multiple-options': MultipleOptionTestConfig,
        'radio-buttons': RadioButtonTestConfig,
        'speed': SpeedTestConfig
    }
}
