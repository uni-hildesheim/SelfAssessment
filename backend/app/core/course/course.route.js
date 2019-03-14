const overlord = require('./../../utils/overseer');

module.exports = {
    v1
}

function v1(app) {
    const controller = require('./course.controller');

    app.get('/api/v1/course', overlord.wrapFunction(controller.showCourses));
    app.post('/api/v1/course/loadConfig', overlord.wrapFunction(controller.loadConfig));
}
