const sinon = require('sinon');

const CourseModel = require('../../app/model/course.model');
const JournalModel = require('../../app/model/journal.model');
const ResultModel = require('../../app/model/result.model');
const ResultController = require('../../app/controller/result.controller');

describe('ResultController', () => {
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

    const JournalInstance = new JournalModel({
        associatedPin: "98667585",
        lastChanged: new Date(),
        log: {
            "sets": [
                {
                    "maps": [
                        {
                            "val": [
                                false,
                                true
                            ],
                            "key": 1001
                        },
                        {
                            "val": [
                                [
                                    true,
                                    false,
                                    false
                                ],
                                [
                                    false,
                                    true,
                                    false
                                ]
                            ],
                            "key": 1002
                        }
                    ]
                },
                {
                    "maps": [
                        {
                            "val": [
                                "brown fo",
                                "my cat see",
                                "think of the"
                            ],
                            "key": 1005
                        },
                        {
                            "val": [
                                false,
                                false
                            ],
                            "key": 1003
                        }
                    ]
                }
            ]
        },
        structure: {
            "course": "IMIT",
            "language": "English",
            "sets": [
                {
                    "tests": [
                        1001,
                        1002
                    ],
                    "set": 3001
                },
                {
                    "tests": [
                        1005,
                        1003
                    ],
                    "set": 3002
                }
            ]
        },
    });

    const ResultInstance = new ResultModel ({
        "associatedPin": '98667585',
        "lastChanged": new Date(),
        "validationCode": '',
        "tests": []
    });

    beforeEach( () => {
        // common response object with spies
        this.res = {
            json: sinon.spy(),
            status: sinon.stub().returns({
                json: sinon.spy(),
                send: sinon.spy()
            })
        };
    });

    afterEach( () => {
        // cleanup and remove stubs
        sinon.restore();
    });

    describe('.load(req, res)', () => {
        it('should return HTTP 404 for invalid pin', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);
            sinon.stub(JournalModel, 'findOne').resolves(null);
            sinon.stub(ResultModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: "00000000"
                }
            };

            await ResultController.load(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.notCalled(CourseModel.findOne);
            sinon.assert.notCalled(ResultModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should calculate result and save to the DB', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(CourseInstance);
            sinon.stub(JournalModel, 'findOne').resolves(JournalInstance);
            sinon.stub(ResultModel, 'updateOne').resolves(ResultInstance);

            const req = {
                body: {
                    pin: "98667585"
                }
            };

            const expectedResult = [
                {
                    "id": "1002",
                    "score": 1,
                    "maxScore": 2,
                    "correctOptions": [0],
                    "wrongOptions": [1]
                },
                {
                    "id": "1003",
                    "score": 0,
                    "maxScore": 1,
                    "correctOptions": [],
                    "wrongOptions": []
                },
                {
                    "id": "1005",
                    "score": 1,
                    "maxScore": 3,
                    "correctOptions": [1],
                    "wrongOptions": [0, 2]
                }
            ]

            await ResultController.load(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(ResultModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
            sinon.assert.calledWith(this.res.status().json, expectedResult);
        });
    });

    describe('.freeze(req, res)', () => {
        it('should return HTTP 404 for invalid pin ', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(null);
            sinon.stub(JournalModel, 'findOne').resolves(null);
            sinon.stub(ResultModel, 'findOne').resolves(null);
            sinon.stub(ResultModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: "00000000"
                }
            };

            await ResultController.freeze(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.notCalled(CourseModel.findOne);
            sinon.assert.notCalled(ResultModel.findOne);
            sinon.assert.notCalled(ResultModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 404);
            sinon.assert.calledOnce(this.res.status().send);
        });

        it('should generate a validation code', async () => {
            sinon.stub(CourseModel, 'findOne').resolves(CourseInstance);
            sinon.stub(JournalModel, 'findOne').resolves(JournalInstance);
            sinon.stub(ResultModel, 'findOne').resolves(ResultInstance);
            sinon.stub(ResultModel, 'updateOne').resolves(null);

            // TODO: Ideally, each test should get its own test data, or all tests should be
            // executed in a specific, synchronous order (which Jasmine does not do).
            // Because of that, the next test cannot use ResultInstance because there might
            // be a race and the validationCode attribute ends up being modified in the wrong
            // order.

            const req = {
                body: {
                    pin: "98667585"
                }
            };

            await ResultController.freeze(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(ResultModel.findOne);
            sinon.assert.calledOnce(ResultModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);
        });

        it('should not overwrite existing validation codes', async () => {
            const resultInstance = new ResultModel({ validationCode: 'DUMMY' });
            sinon.stub(CourseModel, 'findOne').resolves(CourseInstance);
            sinon.stub(JournalModel, 'findOne').resolves(JournalInstance);
            sinon.stub(ResultModel, 'findOne').resolves(resultInstance);
            sinon.stub(ResultModel, 'updateOne').resolves(null);

            const req = {
                body: {
                    pin: "98667585"
                }
            };

            await ResultController.freeze(req, this.res);
            sinon.assert.calledOnce(JournalModel.findOne);
            sinon.assert.calledOnce(CourseModel.findOne);
            sinon.assert.calledOnce(ResultModel.findOne);
            sinon.assert.notCalled(ResultModel.updateOne);
            sinon.assert.calledOnce(this.res.status);
            sinon.assert.calledWith(this.res.status, 200);
            sinon.assert.calledOnce(this.res.status().json);

            expect(resultInstance.validationCode).toBe('DUMMY');
        });
    });
});
