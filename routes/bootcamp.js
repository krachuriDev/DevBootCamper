const express = require('express');
const { protected, authorize } = require('../middleware/auth');

const { getBootcamps, getBootcampById, updateBootcamp, createBootcamp, deleteBootcamp, getBootcampsInRadius } = require('../controllers/BootcampController')
const advancedResults = require('../middleware/advancedResult');
const BootCamp = require('../models/Bootcamp');


// Include other resource routers
const courseRouter = require('./course');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/').get(advancedResults(BootCamp, 'courses'), getBootcamps)
    .post(protected, authorize('publisher', 'admin'), createBootcamp);

router.route('/:id').get(getBootcampById).put(protected, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protected, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;