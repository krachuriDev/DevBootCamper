const Nodegeocoder = require('node-geocoder');

const options = {
    provider: 'mapquest',
    httpadapter: 'https',
    apiKey: 'jnASE9Qoqq62G6Kd5vznjPugdt0NvhiK', // for Mapquest, OpenCage, APlace, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = Nodegeocoder(options);

module.exports = geocoder;