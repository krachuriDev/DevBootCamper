const asyncHandler = require('../middleware/asyncHandler');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');

// @desc Get all bootcamps
// @route GET api/v1/bootcamps
// @access Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc Get bootcamp by Id
// @route GET api/v1/bootcamps/:id
// @access Public

exports.getBootcampById = asyncHandler(async (req, res, next) => {

    const singleBootcamp = await Bootcamp.findById(req.params.id);
    console.info(singleBootcamp);
    if (!singleBootcamp) {
        return next(
            new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: singleBootcamp
    });
});

// @desc Update bootcamp
// @route PUT api/v1/bootcamps/:id
// @access Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Resourse not found with id of ${req.params.id}`, 404));
    }

    // verifying loggedIn user is the bootcamp user.
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with the Id:- ${req.user.id} is not authorized to update the bootcamp`, 401));
    }

     bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
   
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc Create new bootcamp
// @route POST api/v1/bootcamps
// @access Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {

    // Gets the user details and add it to req.body
    req.body.user = req.user.id;

    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id })
    console.info(publishedBootcamp);
    console.info(req.user);
    // If the user is not an admin, then they can add only one bootcamp.
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with Id: ${req.user.id} has already publised a bootcamp`, 400));
    }

    const newBootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        sucess: true,
        data: newBootcamp
    });
});

// @desc Delete bootcamp
// @route DELETE api/v1/bootcamps/:id
// @access Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(
            new ErrorResponse(`Resourse not found with id of ${req.params.id}`, 404)
        );
    }

    // verifying loggedIn user is the bootcamp user.
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User with Id: ${req.user.id} is not authorized to delete the bootcamp`, 401));
    }

    bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
});

// @desc Get bootcamp by zipcode and radius
// @route GET api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

    const { zipcode, distance } = req.params;

    // Get let,longitude from geocoder.

    const location = await geocoder.geocode(zipcode);
    const lat = location[0].latitude;
    const long = location[0].longitude;

    /// calculate radius using radians
    /// Divide distance by radius of Earth
    /// Earth radius=3963 mi/ 6278 km

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[long, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });

});