module.exports = {
    v1
}

function v1(app) {
    const controller = require('../controller/course.controller');

    app.get('/api/v1/course', controller.showCourses);
    app.post('/api/v1/course/loadConfig', controller.loadConfig);
}
