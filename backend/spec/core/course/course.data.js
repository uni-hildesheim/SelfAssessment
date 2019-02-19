const CourseModel = require('../../../app/core/course/course.model');

const CourseDocuments = [];
const CourseInstance = new CourseModel({
    name: "IMIT",
    icon: "imit.jpg",
    configs: [{
        "language": "English",
        "config": {
            "title": "IMIT",
            "validationSchema": "AI([A-Z][A-Z][A-Z][a-z][a-z][a-z][a-z][a-z][0-9][0-9])%9",
            "icon": "imit.jpg",
            "tests": [
                {
                    "id": 1001,
                    "type": "logic",
                    "category": "radio-buttons",
                    "description": "This is a simple radio-buttons test.",
                    "task": "Can you <i>see</i> the <b>nice</b> HTML<sup>5</sup> formatting?",
                    "options": [
                        {
                            "text": "Yes"
                        },
                        {
                            "text": "<b>Yes, but in big</b>"
                        }
                    ],
                    "evaluated": false
                },
                {
                    "id": 1002,
                    "type": "logic",
                    "category": "multiple-options",
                    "description": "This is a simple multiple-options test featuring three distinct answer options.",
                    "task": "Please choose the correct answers.",
                    "options": [
                        {
                            "text": "2+2",
                            "correct": 0
                        },
                        {
                            "text": "2*6",
                            "correct": 2
                        }
                    ],
                    "header": [
                        "< 10",
                        "10",
                        "> 10"
                    ],
                    "evaluated": true
                },
                {
                    "id": 1003,
                    "type": "logic",
                    "category": "radio-buttons",
                    "description": "Another radio-buttons test demonstrating LaTeX support.<br> Given: <br> $$f(x)=x^{2}$$ and <br> $$x = 2$$",
                    "task": "Determine $$f(x)$$.",
                    "options": [
                        {
                            "text": "$$0$$"
                        },
                        {
                            "text": "$$\\frac{12}{3}$$",
                            "correct": true
                        }
                    ],
                    "evaluated": true
                },
                {
                    "id": 1005,
                    "type": "logic",
                    "category": "speed",
                    "seconds": 10,
                    "description": "This is a speed test! You only got ten seconds for this one, so hurry up!",
                    "task": "Mark every <ins>animal</ins> in the text below.",
                    "options": [
                        {
                            "text": "The quick brown fox does not jump, at all.",
                            "correct": "fox"
                        },
                        {
                            "text": "Global warming is dangerous. Or is it? My cat seems to enjoy the warm weather.",
                            "correct": "cat"
                        },
                        {
                            "text": "Just kidding, it certainly is not. Just think of the poor penguins.",
                            "correct": "penguins"
                        }
                    ],
                    "evaluated": true
                }
            ],
            "testgroups": [
                {
                    "id": 2001,
                    "tests": [
                        1001
                    ],
                    "select": 1
                },
                {
                    "id": 2002,
                    "tests": [
                        1003
                    ]
                }
            ],
            "sets": [
                {
                    "id": 3001,
                    "elements": [
                        2001,
                        1002
                    ]
                },
                {
                    "id": 3002,
                    "elements": [
                        1005,
                        2002
                    ]
                }
            ],
            "infopages": [
                {
                    "id": 4001,
                    "text": "Select one of the radio buttons.",
                    "belongs": [
                        1001,
                        1003
                    ]
                }
            ]
        }
    }]
});

CourseDocuments.push(CourseInstance);

module.exports = CourseDocuments;
