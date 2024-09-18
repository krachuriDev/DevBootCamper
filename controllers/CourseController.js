const asyncHandler = require('../middleware/asyncHandler');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/ErrorResponse');
const mongoose = require('mongoose');
const Bootcamp = require('../models/Bootcamp');


// @desc Get all courses
// @route GET api/v1/courses
// @route GET api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        if (courses.length === 0) {
            return next(new ErrorResponse('Courses are not available', 404));
        }

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }

});

// @desc Get a single course
// @route GET api/v1/courses/:courseId
// @access Public
exports.getCourseById = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.courseId).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!course) {
        return next(new ErrorResponse(`Course is not found with the id of ${req.params.courseId}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course
    });
})

// @desc Update a single course
// @route PUT api/v1/courses/:courseId
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.courseId);

    if (!course) {
        return next(new ErrorResponse(`Course not found with the id of ${req.params.courseId}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is not authorized to update the course`, 401));
    }

    course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc Delete a single course
// @route DELETE api/v1/courses/:courseId
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.courseId);

    if (!course) {
        return next(new ErrorResponse(`Course not found with the id of ${req.params.courseId}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete the course`, 401));
    }

    course = await Course.findByIdAndDelete(req.params.courseId);

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc Create new course
// @route POST api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp found with the id of ${req.params.bootcampId}`, 404));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.name} is not authorized to add a course to bootcamp ${bootcamp.name}`, 401));
    }

    const newCourse = await Course.create(req.body);
    res.status(201).json({
        sucess: true,
        data: newCourse
    });
});