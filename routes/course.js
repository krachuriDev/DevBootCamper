const express = require('express');
const { getCourses, getCourseById, updateCourse, deleteCourse, createCourse } = require('../controllers/CourseController');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResult');
const { protected, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protected, authorize('publisher', 'admin'), createCourse);

router.route('/:courseId').get(getCourseById).put(protected, authorize('publisher', 'admin'), updateCourse).delete(protected, authorize('publisher', 'admin'), deleteCourse);


module.exports = router;