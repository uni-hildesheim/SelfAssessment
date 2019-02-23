const UserModel = require('../../../app/core/user/user.model');

const UserDocuments = [];
const UserInstance = new UserModel({
    pin: 12345678,
    journal: {
        lastUpdate: new Date(),
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
                },
                {
                    "maps": [
                        {
                            "val": [
                                true,
                                false
                            ],
                            "key": 1006
                        },
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
                },
                {
                    "tests": [
                        1006
                    ],
                    "set": 3003
                }
            ]
        }
    },
    result: {
        "validationCode": '',
        "tests": []
    }
});

UserDocuments.push(UserInstance);

module.exports = UserDocuments;
