const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    name: String,
    icon: String,
    config: Object
});

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel;
