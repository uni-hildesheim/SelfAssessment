const FrontendModel = require('../../../app/core/frontend/frontend.model');

const FrontendDocuments = [];
const FrontendInstance = new FrontendModel({
    name: "Selfassessment v1.0",
    created: new Date(),
    configs: [{
        "language": "English",
        "config": {
            "name": "Selfassessment v1.0",
            "header": "SelfAssessment",
            "footer": "&copy; 2019 Stiftung Universität Hildesheim",
            "vendor": {
                "name": "Stiftung Universität Hildesheim",
                "logo": "uni_hildesheim_logo.svg"
            },
            "strings": {
                "language": "Language"
            },
            "language": "English"
        }
    }]
});
FrontendDocuments.push(FrontendInstance);

module.exports = FrontendDocuments;
